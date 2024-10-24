// routes/AdminRoute.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

// Admin login route
router.post('/login', adminController.login);

// Route for adding subjects
router.post('/addsubjects', adminController.addSubject);

// Route to fetch subjects based on regulation, department, and semester
router.post('/fetchsubjects', adminController.fetchSubjects);

// Route to update a subject by ID
router.put('/subjects/update/:id', adminController.updateSubject);

// Route to delete a subject by ID
router.delete('/subjects/delete/:id', adminController.deleteSubject);

// Route to add a student
router.post('/students/add', adminController.addStudent);

// Route to search students
router.get('/students/search', adminController.searchStudents);

module.exports = router;
