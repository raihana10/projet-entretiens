const jwt = require('jsonwebtoken');
const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-student-service';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Store decoded user info in request
    req.user = {
      id: decoded.userId,
      role: decoded.role || 'student',
      status: decoded.status || 'active'
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware to check if user has specific role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Middleware to check if user is student or has access to student data
const requireStudentAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Allow if user is organizer or committee member
    if (['organizer', 'committee'].includes(req.user.role)) {
      return next();
    }

    // For students, check if they're accessing their own data
    if (req.user.role === 'student') {
      const studentId = req.params.studentId || req.params.id;
      if (studentId && studentId !== req.user.id.toString()) {
        return res.status(403).json({ error: 'Can only access own student data' });
      }
      return next();
    }

    res.status(403).json({ error: 'Insufficient permissions' });
  } catch (error) {
    console.error('Student access middleware error:', error);
    res.status(500).json({ error: 'Authorization error' });
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireStudentAccess
}; 