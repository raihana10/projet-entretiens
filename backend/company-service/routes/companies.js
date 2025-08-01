const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// Public routes (for students to view companies)
router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);

// Protected routes (for organizers)
router.post('/', companyController.createCompany);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

// Queue management routes
router.get('/:id/queue', companyController.getCompanyQueue);
router.post('/:id/queue', companyController.addStudentToQueue);
router.delete('/:id/queue', companyController.removeStudentFromQueue);

// Interview management routes
router.post('/:id/interview/start', companyController.startInterview);
router.post('/:id/interview/end', companyController.endInterview);

// Statistics
router.get('/:id/stats', companyController.getCompanyStats);

module.exports = router; 