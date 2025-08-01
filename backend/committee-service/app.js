const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const committeeRoutes = require('./routes/committee');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3004;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/committee_service';

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
  console.log('New committee member connected:', socket.id);

  // Join room for specific committee member
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Committee member joined room: ${roomId}`);
  });

  // Handle interview start
  socket.on('interview-started', (data) => {
    socket.to(data.roomId).emit('interview-started', data);
    console.log('Interview started:', data);
  });

  // Handle interview end
  socket.on('interview-ended', (data) => {
    socket.to(data.roomId).emit('interview-ended', data);
    console.log('Interview ended:', data);
  });

  // Handle status updates
  socket.on('status-update', (data) => {
    socket.to(data.roomId).emit('status-update', data);
    console.log('Status updated:', data);
  });

  socket.on('disconnect', () => {
    console.log('Committee member disconnected:', socket.id);
  });
});

// Routes
app.use('/api/committee', committeeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'committee-service',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    websocket: io.engine.clientsCount
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
  console.log(`Committee service running on port ${PORT}`);
});

module.exports = { app, io }; 