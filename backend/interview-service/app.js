const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
require('dotenv').config();

const interviewRoutes = require('./routes/interviews');
const Interview = require('./models/Interview');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3005;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/interview_service';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join room for specific company
  socket.on('join-company', (companyId) => {
    socket.join(`company-${companyId}`);
    console.log(`Client joined company room: ${companyId}`);
  });

  // Join room for specific student
  socket.on('join-student', (studentId) => {
    socket.join(`student-${studentId}`);
    console.log(`Client joined student room: ${studentId}`);
  });

  // Handle interview updates
  socket.on('interview-update', (data) => {
    socket.to(`company-${data.companyId}`).emit('interview-update', data);
    socket.to(`student-${data.studentId}`).emit('interview-update', data);
    console.log('Interview update:', data);
  });

  // Handle queue updates
  socket.on('queue-update', (data) => {
    socket.to(`company-${data.companyId}`).emit('queue-update', data);
    console.log('Queue update:', data);
  });

  // Handle notifications
  socket.on('notification', (data) => {
    socket.to(`student-${data.studentId}`).emit('notification', data);
    console.log('Notification sent:', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Cron jobs for automated tasks
cron.schedule('*/5 * * * *', async () => {
  // Check for approaching interviews every 5 minutes
  try {
    const approachingInterviews = await Interview.find({
      status: { $in: ['scheduled', 'waiting'] },
      scheduledTime: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 15 * 60000) // 15 minutes from now
      }
    });

    approachingInterviews.forEach(interview => {
      io.to(`student-${interview.studentId}`).emit('notification', {
        type: 'approaching',
        message: `Your interview with ${interview.companyName} is approaching`,
        interviewId: interview._id,
        scheduledTime: interview.scheduledTime
      });
    });

    console.log(`Sent ${approachingInterviews.length} approaching notifications`);
  } catch (error) {
    console.error('Error in approaching interviews cron job:', error);
  }
});

cron.schedule('0 * * * *', async () => {
  // Clean up old completed interviews every hour
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const deletedCount = await Interview.deleteMany({
      status: 'completed',
      endTime: { $lt: oneWeekAgo }
    });

    console.log(`Cleaned up ${deletedCount.deletedCount} old interviews`);
  } catch (error) {
    console.error('Error in cleanup cron job:', error);
  }
});

// Routes
app.use('/api/interviews', interviewRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'interview-service',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    websocket: io.engine.clientsCount,
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Interview service running on port ${PORT}`);
});

module.exports = { app, io }; 