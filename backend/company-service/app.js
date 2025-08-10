const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB, Company } = require('./models');
const companyRoutes = require('./routes/companies');
const config = require('./config/config');

const app = express();
const env = process.env.NODE_ENV || 'development';
const PORT = config[env].port;

// Initialize MongoDB connection
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/companies', companyRoutes);

// Health check
app.get('/health', (req, res) => {
  const { mongoose } = require('./models');
  res.status(200).json({ 
    status: 'OK', 
    service: 'company-service',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
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

app.listen(PORT, () => {
  console.log(`Company service running on port ${PORT}`);
});

module.exports = app; 