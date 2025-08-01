const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middlewares/auth');

// All routes require authentication
router.use(authenticateToken);

// Routes for organizers only
router.get('/', requireRole(['organizer']), userController.getAllUsers);
router.post('/', requireRole(['organizer']), userController.createUser);
router.get('/:id', requireRole(['organizer']), userController.getUserById);
router.put('/:id', requireRole(['organizer']), userController.updateUser);
router.delete('/:id', requireRole(['organizer']), userController.deleteUser);

// Routes for specific roles
router.get('/role/:role', requireRole(['organizer']), userController.getUsersByRole);
router.get('/committee/members', requireRole(['organizer']), userController.getCommitteeMembers);
router.get('/students', requireRole(['organizer']), userController.getStudents);

module.exports = router; 