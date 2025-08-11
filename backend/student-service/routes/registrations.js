const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, requireRole } = require('../middlewares/auth');

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

/**
 * Routes spécifiques d'abord
 */

// Registration par entreprise
router.get('/company/:companyId', requireRole(['organizer', 'committee']), studentController.getRegistrationsByCompany);

// Registration par statut
router.get('/status/:status', requireRole(['organizer', 'committee']), studentController.getRegistrationsByStatus);

/**
 * Routes de gestion des inscriptions (organizers & committee)
 */
router.get('/', requireRole(['organizer', 'committee']), studentController.getAllRegistrations);
router.post('/', requireRole(['student', 'organizer']), studentController.createStudentRegistration);

// Routes avec ID (génériques → en dernier)
router.get('/:id', requireRole(['organizer', 'committee']), studentController.getRegistrationById);
router.put('/:id', requireRole(['organizer', 'committee']), studentController.updateRegistration);
router.delete('/:id', requireRole(['organizer']), studentController.deleteRegistration);

module.exports = router;
