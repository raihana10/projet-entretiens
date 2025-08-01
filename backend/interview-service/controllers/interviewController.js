const Interview = require('../models/Interview');
const PriorityService = require('../services/priorityService');

// Get all interviews
const getAllInterviews = async (req, res) => {
  try {
    const { status, companyId, studentId, room } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (companyId) filter.companyId = companyId;
    if (studentId) filter.studentId = studentId;
    if (room) filter.room = room;

    const interviews = await Interview.find(filter)
      .sort({ scheduledTime: 1 });

    res.json({ interviews });
  } catch (error) {
    console.error('Get all interviews error:', error);
    res.status(500).json({ error: 'Failed to get interviews' });
  }
};

// Get interview by ID
const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.json({ interview });
  } catch (error) {
    console.error('Get interview by ID error:', error);
    res.status(500).json({ error: 'Failed to get interview' });
  }
};

// Create new interview
const createInterview = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      companyId,
      companyName,
      room,
      committeeMemberId,
      opportunityType,
      studentType,
      isCommitteeMember,
      scheduledTime,
      estimatedDuration
    } = req.body;

    // Calculate priority
    const priority = PriorityService.calculatePriority(
      studentType,
      opportunityType,
      isCommitteeMember
    );

    // Check for conflicts
    const conflicts = await PriorityService.checkTimeConflicts(
      studentId,
      companyId,
      scheduledTime,
      estimatedDuration
    );

    if (conflicts.length > 0) {
      return res.status(400).json({
        error: 'Time conflict detected',
        conflicts: conflicts.map(c => ({
          id: c._id,
          companyName: c.companyName,
          scheduledTime: c.scheduledTime
        }))
      });
    }

    // Get position in queue
    const queueLength = await Interview.countDocuments({
      companyId,
      status: { $in: ['scheduled', 'waiting'] }
    });

    const interview = new Interview({
      studentId,
      studentName,
      companyId,
      companyName,
      room,
      committeeMemberId,
      opportunityType,
      priority,
      position: queueLength + 1,
      estimatedDuration,
      scheduledTime
    });

    await interview.save();

    res.status(201).json({
      message: 'Interview created successfully',
      interview
    });
  } catch (error) {
    console.error('Create interview error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create interview' });
  }
};

// Start interview
const startInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    await interview.startInterview();

    res.json({
      message: 'Interview started successfully',
      interview
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ error: error.message });
  }
};

// End interview
const endInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    await interview.endInterview();

    res.json({
      message: 'Interview ended successfully',
      interview
    });
  } catch (error) {
    console.error('End interview error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Cancel interview
const cancelInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    await interview.cancelInterview(reason);

    res.json({
      message: 'Interview cancelled successfully',
      interview
    });
  } catch (error) {
    console.error('Cancel interview error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mark interview as no show
const markAsNoShow = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    await interview.markAsNoShow();

    res.json({
      message: 'Interview marked as no show',
      interview
    });
  } catch (error) {
    console.error('Mark as no show error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get interviews by company
const getInterviewsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status } = req.query;

    const interviews = await Interview.findByCompany(companyId, status);

    res.json({ interviews });
  } catch (error) {
    console.error('Get interviews by company error:', error);
    res.status(500).json({ error: 'Failed to get interviews' });
  }
};

// Get interviews by student
const getInterviewsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status } = req.query;

    const interviews = await Interview.findByStudent(studentId, status);

    res.json({ interviews });
  } catch (error) {
    console.error('Get interviews by student error:', error);
    res.status(500).json({ error: 'Failed to get interviews' });
  }
};

// Get upcoming interviews
const getUpcomingInterviews = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const interviews = await Interview.findUpcoming(parseInt(limit));

    res.json({ interviews });
  } catch (error) {
    console.error('Get upcoming interviews error:', error);
    res.status(500).json({ error: 'Failed to get upcoming interviews' });
  }
};

// Get interviews in progress
const getInterviewsInProgress = async (req, res) => {
  try {
    const interviews = await Interview.findInProgress();

    res.json({ interviews });
  } catch (error) {
    console.error('Get interviews in progress error:', error);
    res.status(500).json({ error: 'Failed to get interviews in progress' });
  }
};

// Optimize queue for a company
const optimizeQueue = async (req, res) => {
  try {
    const { companyId } = req.params;
    const optimizedInterviews = await PriorityService.optimizeQueue(companyId);

    res.json({
      message: 'Queue optimized successfully',
      interviews: optimizedInterviews
    });
  } catch (error) {
    console.error('Optimize queue error:', error);
    res.status(500).json({ error: 'Failed to optimize queue' });
  }
};

// Get queue statistics
const getQueueStats = async (req, res) => {
  try {
    const { companyId } = req.params;
    const stats = await PriorityService.getQueueStats(companyId);

    res.json({ stats });
  } catch (error) {
    console.error('Get queue stats error:', error);
    res.status(500).json({ error: 'Failed to get queue statistics' });
  }
};

// Resolve conflicts
const resolveConflicts = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PriorityService.resolveConflicts(id);

    res.json({
      message: result.resolved ? 'Conflicts resolved successfully' : 'No conflicts found',
      resolved: result.resolved,
      newTime: result.newTime
    });
  } catch (error) {
    console.error('Resolve conflicts error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get interview statistics
const getInterviewStats = async (req, res) => {
  try {
    const stats = await Interview.getStats();

    res.json({ stats });
  } catch (error) {
    console.error('Get interview stats error:', error);
    res.status(500).json({ error: 'Failed to get interview statistics' });
  }
};

// Check student availability
const checkStudentAvailability = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startTime, endTime } = req.body;

    const availability = await PriorityService.checkStudentAvailability(studentId, {
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    });

    res.json({ availability });
  } catch (error) {
    console.error('Check student availability error:', error);
    res.status(500).json({ error: 'Failed to check student availability' });
  }
};

module.exports = {
  getAllInterviews,
  getInterviewById,
  createInterview,
  startInterview,
  endInterview,
  cancelInterview,
  markAsNoShow,
  getInterviewsByCompany,
  getInterviewsByStudent,
  getUpcomingInterviews,
  getInterviewsInProgress,
  optimizeQueue,
  getQueueStats,
  resolveConflicts,
  getInterviewStats,
  checkStudentAvailability
}; 