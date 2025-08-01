const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

// Public routes
router.get('/', interviewController.getAllInterviews);
router.get('/upcoming', interviewController.getUpcomingInterviews);
router.get('/in-progress', interviewController.getInterviewsInProgress);
router.get('/stats', interviewController.getInterviewStats);
router.get('/:id', interviewController.getInterviewById);

// Company-specific routes
router.get('/company/:companyId', interviewController.getInterviewsByCompany);
router.get('/company/:companyId/queue/optimize', interviewController.optimizeQueue);
router.get('/company/:companyId/queue/stats', interviewController.getQueueStats);

// Student-specific routes
router.get('/student/:studentId', interviewController.getInterviewsByStudent);
router.post('/student/:studentId/availability', interviewController.checkStudentAvailability);

// Interview management routes
router.post('/', interviewController.createInterview);
router.post('/:id/start', interviewController.startInterview);
router.post('/:id/end', interviewController.endInterview);
router.post('/:id/cancel', interviewController.cancelInterview);
router.post('/:id/no-show', interviewController.markAsNoShow);

// Conflict resolution
router.post('/:id/resolve-conflicts', interviewController.resolveConflicts);

module.exports = router; 