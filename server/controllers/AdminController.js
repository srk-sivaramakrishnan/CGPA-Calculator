// controllers/AdminController.js
const bcrypt = require('bcrypt');
const adminModel = require('../models/AdminModel'); // Adjust the path if necessary

// Admin login function
exports.login = async (req, res) => {
    const { admin_id, password } = req.body;

    try {
        const admin = await adminModel.getAdminById(admin_id);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const match = await bcrypt.compare(password, admin.password);

        if (!match) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.status(200).json({ message: 'Login successful', admin });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add Subject function
exports.addSubject = async (req, res) => {
    const { regulation, department, semester, total_subjects, total_credits, subjects } = req.body;

    if (!regulation || !department || !semester || !Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({ message: 'Regulation, Department, Semester, and Subjects are required.' });
    }

    try {
        for (const subject of subjects) {
            const { code, name, credits } = subject;
            if (!code || !name || !credits) {
                return res.status(400).json({ message: 'All subject fields must be filled' });
            }

            await adminModel.addSubject({
                regulation,
                department,
                semester: parseInt(semester),
                total_subjects,
                total_credits,
                subject_code: code,
                subject_name: name,
                credits: parseFloat(credits),
            });
        }

        res.status(200).json({ message: 'Subjects added successfully' });
    } catch (error) {
        console.error('Error adding subjects:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to fetch subjects based on regulation, department, and semester
exports.fetchSubjects = async (req, res) => {
    const { regulation, department, semester } = req.body;

    if (!regulation || !department || !semester) {
        return res.status(400).json({ message: 'Regulation, Department, and Semester are required.' });
    }

    try {
        const subjects = await adminModel.getSubjectsByCriteria(regulation, department, semester);

        if (subjects.length === 0) {
            return res.status(404).json({ message: 'No subjects found for the given criteria.' });
        }

        const totalCredits = subjects.reduce((sum, subject) => {
            const creditValue = parseFloat(subject.credits);
            return sum + creditValue;
        }, 0);

        const formattedSubjects = subjects.map(subject => {
            const creditValue = parseFloat(subject.credits);
            return {
                id: subject.id,
                subject_code: subject.subject_code,
                subject_name: subject.subject_name,
                credits: Number.isInteger(creditValue) ? creditValue.toFixed(0) : creditValue.toFixed(1)
            };
        });

        res.status(200).json({
            total_credits: totalCredits,
            total_subjects: formattedSubjects.length,
            subjects: formattedSubjects,
        });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to update a subject by ID
exports.updateSubject = async (req, res) => {
    const { id } = req.params;
    const { subject_code, subject_name, credits } = req.body;
    
    try {
        await adminModel.updateSubject(id, { subject_code, subject_name, credits });
        res.status(200).json({ message: 'Subject updated successfully' });
    } catch (error) {
        console.error('Error updating subject:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to delete a subject by ID
exports.deleteSubject = async (req, res) => {
    const { id } = req.params;

    try {
        await adminModel.deleteSubject(id);
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add Student function
exports.addStudent = async (req, res) => {
    const { name, rollNo, registerNo, department, year, className, mobileNo, email, password } = req.body;

    try {
        // Check for existing roll number, register number, email, and mobile number
        const existingStudent = await adminModel.findStudentByUniqueFields(rollNo, registerNo, email, mobileNo);
        if (existingStudent) {
            return res.status(400).json({ error: 'Roll No, Register No, Email, or Mobile No already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const studentData = await adminModel.addStudent({
            name,
            rollNo,
            registerNo,
            department,
            year,
            className,
            mobileNo,
            email,
            password: hashedPassword, // Store the hashed password
        });

        res.status(201).json({ message: 'Student added successfully', student: studentData });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ error: 'Failed to add student' });
    }
};

// Controller to search students based on criteria
exports.searchStudents = async (req, res) => {
    const { category, query } = req.query;

    // Validate category to prevent SQL injection
    const validCategories = ['name', 'roll_no', 'register_no', 'email', 'mobile_no']; // Update to actual column names
    if (!validCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid search category' });
    }

    try {
        const students = await adminModel.searchStudents(category, query);

        if (students.length === 0) {
            return res.status(404).json({ message: `No students found for the search query: "${query}"` });
        }

        // Successfully return student data
        res.status(200).json(students); 
    } catch (error) {
        console.error('Error searching students:', error);
        res.status(500).json({ message: 'An error occurred while fetching students' });
    }
};
