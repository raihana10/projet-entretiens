const express = require('express');
const router = express.Router();
const committeeController = require('../controllers/committeeController');

// Public routes
router.get('/', committeeController.getAllCommitteeMembers);
router.get('/active', committeeController.getActiveCommitteeMembers);
router.get('/room/:room', committeeController.getCommitteeMemberByRoom);
router.get('/:id', committeeController.getCommitteeMemberById);

// Protected routes (for organizers)
router.post('/', committeeController.createCommitteeMember);
router.put('/:id', committeeController.updateCommitteeMember);
router.delete('/:id', committeeController.deleteCommitteeMember);

// Interview management routes
router.post('/:id/interview/start', committeeController.startInterview);
router.post('/:id/interview/end', committeeController.endInterview);

// Dashboard and statistics
router.get('/:id/dashboard', committeeController.getDashboard);
router.get('/:id/stats', committeeController.getCommitteeStats);
router.put('/:id/status', committeeController.updateStatus);

module.exports = router; 