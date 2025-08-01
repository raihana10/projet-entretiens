const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  try {
    const decoded = jwt.verify(token, config[process.env.NODE_ENV || 'development'].jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

const isInterviewOwner = async (req, res, next) => {
  try {
    const interviewId = req.params.id || req.body.interviewId;
    
    if (!interviewId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Interview ID required' 
      });
    }

    // Vérifier si l'utilisateur est le propriétaire de l'entretien
    // Cette logique peut être adaptée selon vos besoins
    if (req.user.role === 'admin' || req.user.role === 'committee_member') {
      return next();
    }

    // Pour les autres rôles, vérifier la propriété
    // Cette logique devrait être implémentée selon votre modèle de données
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error checking interview ownership' 
    });
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  isInterviewOwner
}; 