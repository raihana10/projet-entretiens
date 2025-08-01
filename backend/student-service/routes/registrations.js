const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, requireRole } = require('../middlewares/auth');

// All routes require authentication
router.use(authenticateToken);

// Registration management routes (organizers only)
router.get('/', requireRole(['organizer', 'committee']), studentController.getAllRegistrations);
router.get('/:id', requireRole(['organizer', 'committee']), studentController.getRegistrationById);
router.post('/', requireRole(['student', 'organizer']), studentController.createStudentRegistration);
router.put('/:id', requireRole(['organizer', 'committee']), studentController.updateRegistration);
router.delete('/:id', requireRole(['organizer']), studentController.deleteRegistration);

// Registration by company (organizers and committee)
router.get('/company/:companyId', requireRole(['organizer', 'committee']), studentController.getRegistrationsByCompany);

// Registration by status (organizers and committee)
router.get('/status/:status', requireRole(['organizer', 'committee']), studentController.getRegistrationsByStatus);

module.exports = router; 