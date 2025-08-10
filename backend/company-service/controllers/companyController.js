const { Company } = require('../models');

// Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const { status, industry, search } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (industry) filter.industry = industry;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const companies = await Company.find(filter)
      .select('-queue')
      .sort({ name: 1 });

    res.json({ companies });
  } catch (error) {
    console.error('Get all companies error:', error);
    res.status(500).json({ error: 'Failed to get companies' });
  }
};

// Get company by ID
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ company });
  } catch (error) {
    console.error('Get company by ID error:', error);
    res.status(500).json({ error: 'Failed to get company' });
  }
};

// Create new company
const createCompany = async (req, res) => {
  try {
    const {
      name,
      description,
      logo,
      website,
      industry,
      location,
      contactEmail,
      contactPhone,
      room,
      estimatedDuration,
      maxInterviews,
      opportunities,
      requirements,
      benefits
    } = req.body;

    // Check if room is already taken
    const existingCompany = await Company.findOne({ room });
    if (existingCompany) {
      return res.status(400).json({ error: 'Room is already assigned to another company' });
    }

    const company = new Company({
      name,
      description,
      logo,
      website,
      industry,
      location,
      contactEmail,
      contactPhone,
      room,
      estimatedDuration,
      maxInterviews,
      opportunities,
      requirements,
      benefits
    });

    await company.save();

    res.status(201).json({
      message: 'Company created successfully',
      company
    });
  } catch (error) {
    console.error('Create company error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create company' });
  }
};

// Update company
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if room is being changed and if it's already taken
    if (updateData.room) {
      const existingCompany = await Company.findOne({ 
        room: updateData.room, 
        _id: { $ne: id } 
      });
      if (existingCompany) {
        return res.status(400).json({ error: 'Room is already assigned to another company' });
      }
    }

    const company = await Company.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
      message: 'Company updated successfully',
      company
    });
  } catch (error) {
    console.error('Update company error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update company' });
  }
};

// Delete company
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByIdAndDelete(id);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
};

// Get company queue
const getCompanyQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const queue = company.queue.filter(item => item.status === 'waiting');
    const currentInterview = company.currentInterview;

    res.json({
      queue,
      currentInterview,
      queueLength: queue.length,
      currentInterviews: company.currentInterviews,
      maxInterviews: company.maxInterviews
    });
  } catch (error) {
    console.error('Get company queue error:', error);
    res.status(500).json({ error: 'Failed to get company queue' });
  }
};

// Add student to queue
const addStudentToQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, opportunityType, priority = 1 } = req.body;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Check if student is already in queue
    const existingInQueue = company.queue.find(
      item => item.studentId === studentId && item.status === 'waiting'
    );
    if (existingInQueue) {
      return res.status(400).json({ error: 'Student is already in queue' });
    }

    // Check if company accepts this opportunity type
    if (!company.opportunities[opportunityType]) {
      return res.status(400).json({ error: 'Company does not accept this opportunity type' });
    }

    // Check if company has reached max interviews
    if (company.currentInterviews >= company.maxInterviews) {
      return res.status(400).json({ error: 'Company has reached maximum interviews' });
    }

    await company.addToQueue(studentId, opportunityType, priority);

    res.json({
      message: 'Student added to queue successfully',
      position: company.queue.length
    });
  } catch (error) {
    console.error('Add student to queue error:', error);
    res.status(500).json({ error: 'Failed to add student to queue' });
  }
};

// Remove student from queue
const removeStudentFromQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    await company.removeFromQueue(studentId);

    res.json({ message: 'Student removed from queue successfully' });
  } catch (error) {
    console.error('Remove student from queue error:', error);
    res.status(500).json({ error: 'Failed to remove student from queue' });
  }
};

// Start interview
const startInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    await company.startInterview(studentId);

    res.json({
      message: 'Interview started successfully',
      currentInterview: company.currentInterview
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

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    await company.endInterview();

    // Get next student in queue
    const nextStudent = company.getNextStudent();

    res.json({
      message: 'Interview ended successfully',
      nextStudent
    });
  } catch (error) {
    console.error('End interview error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get company statistics
const getCompanyStats = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const stats = {
      totalInQueue: company.queue.filter(item => item.status === 'waiting').length,
      completedInterviews: company.queue.filter(item => item.status === 'completed').length,
      currentInterviews: company.currentInterviews,
      maxInterviews: company.maxInterviews,
      currentInterview: company.currentInterview,
      averageWaitTime: 0 // TODO: Calculate average wait time
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get company stats error:', error);
    res.status(500).json({ error: 'Failed to get company statistics' });
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyQueue,
  addStudentToQueue,
  removeStudentFromQueue,
  startInterview,
  endInterview,
  getCompanyStats
}; 