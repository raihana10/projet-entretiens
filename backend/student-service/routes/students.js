const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, requireRole, requireStudentAccess } = require('../middlewares/auth');

// All routes require authentication
router.use(authenticateToken);

// Student routes
router.get('/', requireRole(['organizer', 'committee']), studentController.getAllStudents);
router.get('/type/:studentType', requireRole(['organizer', 'committee']), studentController.getStudentsByType);
router.get('/:id', requireStudentAccess, studentController.getStudentById);
router.post('/', requireRole(['student', 'organizer']), studentController.createStudent);
router.put('/:id', requireStudentAccess, studentController.updateStudent);
router.delete('/:id', requireRole(['organizer']), studentController.deleteStudent);

// Registration routes
router.get('/:studentId/registrations', requireStudentAccess, studentController.getStudentRegistrations);
router.post('/:studentId/registrations', requireStudentAccess, studentController.createStudentRegistration);
router.put('/registrations/:id', requireStudentAccess, studentController.updateRegistration);
router.delete('/registrations/:id', requireStudentAccess, studentController.deleteRegistration);

// Statistics
router.get('/:studentId/stats', requireStudentAccess, studentController.getStudentStats);

module.exports = router; 