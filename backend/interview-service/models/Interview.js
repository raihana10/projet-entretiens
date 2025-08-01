const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  companyId: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  committeeMemberId: {
    type: String,
    required: true
  },
  opportunityType: {
    type: String,
    enum: ['PFA', 'PFE', 'stage_observation', 'emploi'],
    required: true
  },
  priority: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: String,
    enum: ['scheduled', 'waiting', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  position: {
    type: Number,
    required: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true,
    default: 15
  },
  actualDuration: {
    type: Number, // in minutes
    default: null
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    default: null
  },
  endTime: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  conflicts: [{
    type: {
      type: String,
      enum: ['time_conflict', 'student_conflict', 'room_conflict'],
      required: true
    },
    description: String,
    resolved: {
      type: Boolean,
      default: false
    },
    resolvedAt: Date
  }],
  notifications: [{
    type: {
      type: String,
      enum: ['scheduled', 'approaching', 'ready', 'started', 'ended'],
      required: true
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    sentTo: {
      type: String,
      enum: ['student', 'committee', 'organizer'],
      required: true
    },
    message: String
  }]
}, {
  timestamps: true
});

// Indexes
interviewSchema.index({ studentId: 1 });
interviewSchema.index({ companyId: 1 });
interviewSchema.index({ status: 1 });
interviewSchema.index({ scheduledTime: 1 });
interviewSchema.index({ room: 1, status: 1 });

// Virtual for interview duration
interviewSchema.virtual('duration').get(function() {
  if (this.startTime && this.endTime) {
    return Math.floor((this.endTime - this.startTime) / 1000 / 60); // in minutes
  }
  return null;
});

// Virtual for wait time
interviewSchema.virtual('waitTime').get(function() {
  if (this.startTime && this.scheduledTime) {
    return Math.floor((this.startTime - this.scheduledTime) / 1000 / 60); // in minutes
  }
  return null;
});

// Method to start interview
interviewSchema.methods.startInterview = function() {
  if (this.status !== 'waiting') {
    throw new Error('Interview is not in waiting status');
  }
  
  this.status = 'in_progress';
  this.startTime = new Date();
  
  // Add notification
  this.notifications.push({
    type: 'started',
    sentTo: 'student',
    message: `Your interview with ${this.companyName} has started`
  });
  
  return this.save();
};

// Method to end interview
interviewSchema.methods.endInterview = function() {
  if (this.status !== 'in_progress') {
    throw new Error('Interview is not in progress');
  }
  
  this.status = 'completed';
  this.endTime = new Date();
  this.actualDuration = this.duration;
  
  // Add notification
  this.notifications.push({
    type: 'ended',
    sentTo: 'student',
    message: `Your interview with ${this.companyName} has ended`
  });
  
  return this.save();
};

// Method to cancel interview
interviewSchema.methods.cancelInterview = function(reason = 'Cancelled by student') {
  if (this.status === 'completed') {
    throw new Error('Cannot cancel completed interview');
  }
  
  this.status = 'cancelled';
  this.notes = reason;
  
  return this.save();
};

// Method to mark as no show
interviewSchema.methods.markAsNoShow = function() {
  if (this.status === 'completed') {
    throw new Error('Cannot mark completed interview as no show');
  }
  
  this.status = 'no_show';
  
  return this.save();
};

// Static method to get interviews by company
interviewSchema.statics.findByCompany = function(companyId, status = null) {
  const filter = { companyId };
  if (status) filter.status = status;
  return this.find(filter).sort({ scheduledTime: 1 });
};

// Static method to get interviews by student
interviewSchema.statics.findByStudent = function(studentId, status = null) {
  const filter = { studentId };
  if (status) filter.status = status;
  return this.find(filter).sort({ scheduledTime: 1 });
};

// Static method to get interviews by room
interviewSchema.statics.findByRoom = function(room, status = null) {
  const filter = { room };
  if (status) filter.status = status;
  return this.find(filter).sort({ scheduledTime: 1 });
};

// Static method to get upcoming interviews
interviewSchema.statics.findUpcoming = function(limit = 10) {
  return this.find({
    status: { $in: ['scheduled', 'waiting'] },
    scheduledTime: { $gte: new Date() }
  })
  .sort({ scheduledTime: 1 })
  .limit(limit);
};

// Static method to get interviews in progress
interviewSchema.statics.findInProgress = function() {
  return this.find({ status: 'in_progress' });
};

// Static method to get interview statistics
interviewSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgDuration: { $avg: '$actualDuration' }
      }
    }
  ]);
};

module.exports = mongoose.model('Interview', interviewSchema); 