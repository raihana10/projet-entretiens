const { Committee } = require('../models');

// Get all committee members
const getAllCommitteeMembers = async (req, res) => {
  try {
    const { status, room } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (room) filter.assignedRoom = room;

    const committeeMembers = await Committee.find(filter)
      .sort({ fullName: 1 });

    res.json({ committeeMembers });
  } catch (error) {
    console.error('Get all committee members error:', error);
    res.status(500).json({ error: 'Failed to get committee members' });
  }
};

// Get committee member by ID
const getCommitteeMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const committeeMember = await Committee.findById(id);

    if (!committeeMember) {
      return res.status(404).json({ error: 'Committee member not found' });
    }

    res.json({ committeeMember });
  } catch (error) {
    console.error('Get committee member by ID error:', error);
    res.status(500).json({ error: 'Failed to get committee member' });
  }
};

// Get committee member by room
const getCommitteeMemberByRoom = async (req, res) => {
  try {
    const { room } = req.params;
    const committeeMember = await Committee.findByRoom(room);

    if (!committeeMember) {
      return res.status(404).json({ error: 'Committee member not found for this room' });
    }

    res.json({ committeeMember });
  } catch (error) {
    console.error('Get committee member by room error:', error);
    res.status(500).json({ error: 'Failed to get committee member' });
  }
};

// Create new committee member
const createCommitteeMember = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      email,
      phone,
      assignedRoom,
      companyId,
      companyName,
      permissions
    } = req.body;

    // Check if room is already assigned
    const existingMember = await Committee.findOne({ assignedRoom });
    if (existingMember) {
      return res.status(400).json({ error: 'Room is already assigned to another committee member' });
    }

    // Check if user is already a committee member
    const existingUser = await Committee.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ error: 'User is already a committee member' });
    }

    const committeeMember = new Committee({
      userId,
      fullName,
      email,
      phone,
      assignedRoom,
      companyId,
      companyName,
      permissions
    });

    await committeeMember.save();

    res.status(201).json({
      message: 'Committee member created successfully',
      committeeMember
    });
  } catch (error) {
    console.error('Create committee member error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create committee member' });
  }
};

// Update committee member
const updateCommitteeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if room is being changed and if it's already taken
    if (updateData.assignedRoom) {
      const existingMember = await Committee.findOne({ 
        assignedRoom: updateData.assignedRoom, 
        _id: { $ne: id } 
      });
      if (existingMember) {
        return res.status(400).json({ error: 'Room is already assigned to another committee member' });
      }
    }

    const committeeMember = await Committee.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!committeeMember) {
      return res.status(404).json({ error: 'Committee member not found' });
    }

    res.json({
      message: 'Committee member updated successfully',
      committeeMember
    });
  } catch (error) {
    console.error('Update committee member error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update committee member' });
  }
};

// Delete committee member
const deleteCommitteeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const committeeMember = await Committee.findByIdAndDelete(id);

    if (!committeeMember) {
      return res.status(404).json({ error: 'Committee member not found' });
    }

    res.json({ message: 'Committee member deleted successfully' });
  } catch (error) {
    console.error('Delete committee member error:', error);
    res.status(500).json({ error: 'Failed to delete committee member' });
  }
};

// Start interview
const startInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, studentName, opportunityType, estimatedDuration } = req.body;

    const committeeMember = await Committee.findById(id);
    if (!committeeMember) {
      return res.status(404).json({ error: 'Committee member not found' });
    }

    if (!committeeMember.permissions.canStartInterview) {
      return res.status(403).json({ error: 'Permission denied to start interviews' });
    }

    await committeeMember.startInterview(studentId, studentName, opportunityType, estimatedDuration);

    res.json({
      message: 'Interview started successfully',
      currentInterview: committeeMember.currentInterview
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

    const committeeMember = await Committee.findById(id);
    if (!committeeMember) {
      return res.status(404).json({ error: 'Committee member not found' });
    }

    if (!committeeMember.permissions.canEndInterview) {
      return res.status(403).json({ error: 'Permission denied to end interviews' });
    }

    await committeeMember.endInterview();

    res.json({
      message: 'Interview ended successfully',
      sessionStats: committeeMember.sessionStats
    });
  } catch (error) {
    console.error('End interview error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get committee member dashboard
const getDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const committeeMember = await Committee.findById(id);

    if (!committeeMember) {
      return res.status(404).json({ error: 'Committee member not found' });
    }

    // Get queue from company service (this would be a separate API call)
    // For now, we'll return basic dashboard info
    const dashboard = {
      committeeMember: {
        id: committeeMember._id,
        fullName: committeeMember.fullName,
        assignedRoom: committeeMember.assignedRoom,
        companyName: committeeMember.companyName,
        status: committeeMember.status,
        currentInterview: committeeMember.currentInterview,
        sessionStats: committeeMember.sessionStats
      },
      currentInterviewDuration: committeeMember.currentInterviewDuration,
      permissions: committeeMember.permissions
    };

    res.json({ dashboard });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard' });
  }
};

// Get committee member statistics
const getCommitteeStats = async (req, res) => {
  try {
    const { id } = req.params;
    const committeeMember = await Committee.findById(id);

    if (!committeeMember) {
      return res.status(404).json({ error: 'Committee member not found' });
    }

    const stats = {
      totalInterviews: committeeMember.sessionStats.totalInterviews,
      averageDuration: committeeMember.sessionStats.averageDuration,
      lastActivity: committeeMember.sessionStats.lastActivity,
      currentInterviewDuration: committeeMember.currentInterviewDuration,
      status: committeeMember.status
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get committee stats error:', error);
    res.status(500).json({ error: 'Failed to get committee statistics' });
  }
};

// Get all active committee members
const getActiveCommitteeMembers = async (req, res) => {
  try {
    const activeMembers = await Committee.findActive();

    res.json({ activeMembers });
  } catch (error) {
    console.error('Get active committee members error:', error);
    res.status(500).json({ error: 'Failed to get active committee members' });
  }
};

// Update committee member status
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const committeeMember = await Committee.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!committeeMember) {
      return res.status(404).json({ error: 'Committee member not found' });
    }

    res.json({
      message: 'Status updated successfully',
      committeeMember
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

module.exports = {
  getAllCommitteeMembers,
  getCommitteeMemberById,
  getCommitteeMemberByRoom,
  createCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
  startInterview,
  endInterview,
  getDashboard,
  getCommitteeStats,
  getActiveCommitteeMembers,
  updateStatus
}; 