const { Student, StudentRegistration } = require('../models');
const { Op } = require('sequelize');

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, studentType, status, search } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (studentType) whereClause.studentType = studentType;
    if (status) whereClause.status = status;
    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const students = await Student.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: StudentRegistration,
          as: 'registrations'
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      students: students.rows,
      total: students.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(students.count / limit)
    });
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ error: 'Failed to get students' });
  }
};

// Get all registrations
const getAllRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, companyId, studentId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (companyId) whereClause.companyId = companyId;
    if (studentId) whereClause.studentId = studentId;

    const registrations = await StudentRegistration.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Student,
          as: 'student'
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['registrationDate', 'DESC']]
    });

    res.json({
      registrations: registrations.rows,
      total: registrations.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(registrations.count / limit)
    });
  } catch (error) {
    console.error('Get all registrations error:', error);
    res.status(500).json({ error: 'Failed to get registrations' });
  }
};

// Get registration by ID
const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await StudentRegistration.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student'
        }
      ]
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json({ registration });
  } catch (error) {
    console.error('Get registration by ID error:', error);
    res.status(500).json({ error: 'Failed to get registration' });
  }
};

// Get registrations by company
const getRegistrationsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status } = req.query;

    const whereClause = { companyId };
    if (status) whereClause.status = status;

    const registrations = await StudentRegistration.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          as: 'student'
        }
      ],
      order: [['priority', 'DESC'], ['registrationDate', 'ASC']]
    });

    res.json({ registrations });
  } catch (error) {
    console.error('Get registrations by company error:', error);
    res.status(500).json({ error: 'Failed to get registrations by company' });
  }
};

// Get registrations by status
const getRegistrationsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const registrations = await StudentRegistration.findAll({
      where: { status },
      include: [
        {
          model: Student,
          as: 'student'
        }
      ],
      order: [['registrationDate', 'DESC']]
    });

    res.json({ registrations });
  } catch (error) {
    console.error('Get registrations by status error:', error);
    res.status(500).json({ error: 'Failed to get registrations by status' });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id, {
      include: [
        {
          model: StudentRegistration,
          as: 'registrations'
        }
      ]
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ student });
  } catch (error) {
    console.error('Get student by ID error:', error);
    res.status(500).json({ error: 'Failed to get student' });
  }
};

// Create new student
const createStudent = async (req, res) => {
  try {
    const {
      userId,
      studentType,
      phone,
      cv,
      linkedinProfile,
      githubProfile,
      skills,
      interests
    } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ where: { userId } });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student profile already exists for this user' });
    }

    const student = await Student.create({
      userId,
      studentType,
      phone,
      cv,
      linkedinProfile,
      githubProfile,
      skills,
      interests,
      status: 'active'
    });

    res.status(201).json({
      message: 'Student profile created successfully',
      student
    });
  } catch (error) {
    console.error('Create student error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to create student profile' });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await student.update(updateData);

    res.json({
      message: 'Student profile updated successfully',
      student
    });
  } catch (error) {
    console.error('Update student error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to update student profile' });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await student.destroy();

    res.json({ message: 'Student profile deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student profile' });
  }
};

// Get student registrations
const getStudentRegistrations = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status } = req.query;

    const whereClause = { studentId };
    if (status) whereClause.status = status;

    const registrations = await StudentRegistration.findAll({
      where: whereClause,
      order: [['registrationDate', 'DESC']]
    });

    res.json({ registrations });
  } catch (error) {
    console.error('Get student registrations error:', error);
    res.status(500).json({ error: 'Failed to get student registrations' });
  }
};

// Create student registration
const createStudentRegistration = async (req, res) => {
  try {
    const {
      studentId,
      companyId,
      opportunityType,
      priority = 1,
      estimatedTime = 15,
      notes
    } = req.body;

    // Check if registration already exists
    const existingRegistration = await StudentRegistration.findOne({
      where: { studentId, companyId }
    });
    if (existingRegistration) {
      return res.status(400).json({ error: 'Student already registered for this company' });
    }

    const registration = await StudentRegistration.create({
      studentId,
      companyId,
      opportunityType,
      priority,
      estimatedTime,
      notes,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Registration created successfully',
      registration
    });
  } catch (error) {
    console.error('Create registration error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to create registration' });
  }
};

// Update registration
const updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const registration = await StudentRegistration.findByPk(id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    await registration.update(updateData);

    res.json({
      message: 'Registration updated successfully',
      registration
    });
  } catch (error) {
    console.error('Update registration error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to update registration' });
  }
};

// Delete registration
const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await StudentRegistration.findByPk(id);

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    await registration.destroy();

    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({ error: 'Failed to delete registration' });
  }
};

// Get students by type
const getStudentsByType = async (req, res) => {
  try {
    const { studentType } = req.params;
    const students = await Student.findAll({
      where: { studentType },
      include: [
        {
          model: StudentRegistration,
          as: 'registrations'
        }
      ],
      order: [['fullName', 'ASC']]
    });

    res.json({ students });
  } catch (error) {
    console.error('Get students by type error:', error);
    res.status(500).json({ error: 'Failed to get students by type' });
  }
};

// Get student statistics
const getStudentStats = async (req, res) => {
  try {
    const { studentId } = req.params;

    const totalRegistrations = await StudentRegistration.count({
      where: { studentId }
    });

    const completedInterviews = await StudentRegistration.count({
      where: { 
        studentId,
        status: 'completed'
      }
    });

    const pendingRegistrations = await StudentRegistration.count({
      where: { 
        studentId,
        status: 'pending'
      }
    });

    const stats = {
      totalRegistrations,
      completedInterviews,
      pendingRegistrations,
      completionRate: totalRegistrations > 0 ? (completedInterviews / totalRegistrations) * 100 : 0
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({ error: 'Failed to get student statistics' });
  }
};

module.exports = {
  getAllStudents,
  getAllRegistrations,
  getRegistrationById,
  getRegistrationsByCompany,
  getRegistrationsByStatus,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentRegistrations,
  createStudentRegistration,
  updateRegistration,
  deleteRegistration,
  getStudentsByType,
  getStudentStats
}; 