const express = require('express');
const router = express.Router();
const studentController = require('../controllers/StudentController');

// Route for student login
router.post('/login', studentController.studentLogin);

// Route to fetch student data by ID
router.get('/:id', studentController.getStudentById);

// Route for fetching subjects
router.post('/subjects', studentController.fetchSubjects);

// Route for searching elective subjects by subject code
router.get('/electives/search', studentController.searchElectiveSubject);

// Route for storing student subject data
router.post('/subjects/store/:id', studentController.saveStudentSubjects);

// Route for fetching subjects by student ID and semester
router.get('/subjects/:id/semester/:semester', studentController.getSubjectsBySemester);

// Route for editing a student subject by subject_code
router.put('/subjects/:subject_code', studentController.editStudentSubject);

// Route for deleting a student subject by subject_code
router.delete('/subjects/delete/:subject_code', studentController.deleteStudentSubject);

// Route to get calculated GPA for a student by ID
router.get('/gpa/:id', studentController.getCalculatedGPA);

// Route to save CGPA
router.post('/cgpa', studentController.saveCGPA);

// Route to get student details by ID
router.get('/profile/:student_id', studentController.getStudentDetails);

// In your route file
router.get('/profile/cgpa/:id', studentController.getCGPAByStudentId);




module.exports = router;
