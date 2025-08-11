const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, requireRole, requireStudentAccess } = require('../middlewares/auth');

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

/**
 * Routes STUDENTS
 */

// Récupérer tous les étudiants (organizer & committee uniquement)
router.get('/', requireRole(['organizer', 'committee']), studentController.getAllStudents);

// Récupérer les étudiants par type
router.get('/type/:studentType', requireRole(['organizer', 'committee']), studentController.getStudentsByType);

// Récupérer les statistiques d’un étudiant
router.get('/:studentId/stats', requireStudentAccess, studentController.getStudentStats);

/**
 * Routes REGISTRATIONS (liées à un étudiant)
 */
router.get('/:studentId/registrations', requireStudentAccess, studentController.getStudentRegistrations);
router.post('/:studentId/registrations', requireStudentAccess, studentController.createStudentRegistration);

// Routes REGISTRATIONS par ID (pour update/delete)
router.put('/registrations/:id', requireStudentAccess, studentController.updateRegistration);
router.delete('/registrations/:id', requireStudentAccess, studentController.deleteRegistration);

/**
 * Routes CRUD étudiant
 * (Doivent être placées à la fin car elles sont génériques et peuvent matcher beaucoup d’URLs)
 */
router.get('/:id', requireStudentAccess, studentController.getStudentById);
router.post('/', requireRole(['student', 'organizer']), studentController.createStudent);
router.put('/:id', requireStudentAccess, studentController.updateStudent);
router.delete('/:id', requireRole(['organizer']), studentController.deleteStudent);

module.exports = router;
