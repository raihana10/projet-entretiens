const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    default: null
  },
  website: {
    type: String,
    default: null
  },
  industry: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    default: null
  },
  room: {
    type: String,
    required: true,
    unique: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true,
    default: 15
  },
  maxInterviews: {
    type: Number,
    default: 50
  },
  currentInterviews: {
    type: Number,
    default: 0
  },
  opportunities: {
    PFA: {
      type: Boolean,
      default: true
    },
    PFE: {
      type: Boolean,
      default: true
    },
    stage_observation: {
      type: Boolean,
      default: true
    },
    emploi: {
      type: Boolean,
      default: true
    }
  },
  requirements: {
    type: [String],
    default: []
  },
  benefits: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  queue: [{
    studentId: {
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
      default: 1
    },
    position: {
      type: Number,
      required: true
    },
    estimatedTime: {
      type: Number,
      default: 15
    },
    status: {
      type: String,
      enum: ['waiting', 'in_progress', 'completed', 'cancelled'],
      default: 'waiting'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  currentInterview: {
    studentId: {
      type: String,
      default: null
    },
    startTime: {
      type: Date,
      default: null
    },
    opportunityType: {
      type: String,
      enum: ['PFA', 'PFE', 'stage_observation', 'emploi'],
      default: null
    }
  }
}, {
  timestamps: true
});

// Indexes
companySchema.index({ name: 1 });
companySchema.index({ room: 1 });
companySchema.index({ status: 1 });
companySchema.index({ 'queue.studentId': 1 });

// Virtual for queue length
companySchema.virtual('queueLength').get(function() {
  return this.queue.filter(item => item.status === 'waiting').length;
});

// Method to add student to queue
companySchema.methods.addToQueue = function(studentId, opportunityType, priority = 1) {
  const position = this.queue.length + 1;
  this.queue.push({
    studentId,
    opportunityType,
    priority,
    position,
    status: 'waiting'
  });
  return this.save();
};

// Method to remove student from queue
companySchema.methods.removeFromQueue = function(studentId) {
  this.queue = this.queue.filter(item => item.studentId !== studentId);
  // Reorder positions
  this.queue.forEach((item, index) => {
    item.position = index + 1;
  });
  return this.save();
};

// Method to start interview
companySchema.methods.startInterview = function(studentId) {
  const queueItem = this.queue.find(item => 
    item.studentId === studentId && item.status === 'waiting'
  );
  
  if (!queueItem) {
    throw new Error('Student not found in queue or interview already started');
  }
  
  queueItem.status = 'in_progress';
  this.currentInterview = {
    studentId,
    startTime: new Date(),
    opportunityType: queueItem.opportunityType
  };
  
  return this.save();
};

// Method to end interview
companySchema.methods.endInterview = function() {
  if (!this.currentInterview.studentId) {
    throw new Error('No interview in progress');
  }
  
  // Mark current interview as completed
  const queueItem = this.queue.find(item => 
    item.studentId === this.currentInterview.studentId
  );
  if (queueItem) {
    queueItem.status = 'completed';
  }
  
  // Clear current interview
  this.currentInterview = {
    studentId: null,
    startTime: null,
    opportunityType: null
  };
  
  this.currentInterviews += 1;
  return this.save();
};

// Method to get next student in queue
companySchema.methods.getNextStudent = function() {
  const waitingStudents = this.queue
    .filter(item => item.status === 'waiting')
    .sort((a, b) => {
      // Sort by priority first, then by position
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.position - b.position;
    });
  
  return waitingStudents[0] || null;
};

module.exports = mongoose.model('Company', companySchema); 