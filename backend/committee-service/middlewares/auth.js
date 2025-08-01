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

const isCommitteeMember = async (req, res, next) => {
  try {
    const committeeId = req.params.id || req.body.committeeId;
    
    if (!committeeId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Committee ID required' 
      });
    }

    // Vérifier si l'utilisateur est membre du comité
    if (req.user.role === 'admin' || req.user.role === 'committee_member') {
      return next();
    }

    // Pour les autres rôles, vérifier l'appartenance au comité
    // Cette logique devrait être implémentée selon votre modèle de données
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error checking committee membership' 
    });
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  isCommitteeMember
}; 