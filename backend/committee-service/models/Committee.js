const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    default: null
  },
  assignedRoom: {
    type: String,
    required: true,
    unique: true
  },
  companyId: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'busy'],
    default: 'active'
  },
  permissions: {
    canStartInterview: {
      type: Boolean,
      default: true
    },
    canEndInterview: {
      type: Boolean,
      default: true
    },
    canManageQueue: {
      type: Boolean,
      default: true
    },
    canViewStats: {
      type: Boolean,
      default: true
    }
  },
  currentInterview: {
    studentId: {
      type: String,
      default: null
    },
    studentName: {
      type: String,
      default: null
    },
    opportunityType: {
      type: String,
      enum: ['PFA', 'PFE', 'stage_observation', 'emploi'],
      default: null
    },
    startTime: {
      type: Date,
      default: null
    },
    estimatedDuration: {
      type: Number,
      default: 15
    }
  },
  sessionStats: {
    totalInterviews: {
      type: Number,
      default: 0
    },
    averageDuration: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Indexes
committeeSchema.index({ userId: 1 });
committeeSchema.index({ assignedRoom: 1 });
committeeSchema.index({ companyId: 1 });
committeeSchema.index({ status: 1 });

// Virtual for current interview duration
committeeSchema.virtual('currentInterviewDuration').get(function() {
  if (!this.currentInterview.startTime) return 0;
  return Math.floor((Date.now() - this.currentInterview.startTime) / 1000 / 60); // in minutes
});

// Method to start an interview
committeeSchema.methods.startInterview = function(studentId, studentName, opportunityType, estimatedDuration = 15) {
  if (this.status === 'busy') {
    throw new Error('Committee member is already busy with another interview');
  }
  
  this.status = 'busy';
  this.currentInterview = {
    studentId,
    studentName,
    opportunityType,
    startTime: new Date(),
    estimatedDuration
  };
  
  return this.save();
};

// Method to end current interview
committeeSchema.methods.endInterview = function() {
  if (!this.currentInterview.studentId) {
    throw new Error('No interview in progress');
  }
  
  // Calculate duration
  const duration = Math.floor((Date.now() - this.currentInterview.startTime) / 1000 / 60);
  
  // Update stats
  this.sessionStats.totalInterviews += 1;
  this.sessionStats.averageDuration = 
    (this.sessionStats.averageDuration * (this.sessionStats.totalInterviews - 1) + duration) / 
    this.sessionStats.totalInterviews;
  this.sessionStats.lastActivity = new Date();
  
  // Clear current interview
  this.status = 'active';
  this.currentInterview = {
    studentId: null,
    studentName: null,
    opportunityType: null,
    startTime: null,
    estimatedDuration: 15
  };
  
  return this.save();
};

// Method to get committee member by room
committeeSchema.statics.findByRoom = function(room) {
  return this.findOne({ assignedRoom: room });
};

// Method to get all active committee members
committeeSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Method to get committee member by company
committeeSchema.statics.findByCompany = function(companyId) {
  return this.findOne({ companyId });
};

module.exports = mongoose.model('Committee', committeeSchema); 