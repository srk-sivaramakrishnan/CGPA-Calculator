// models/AdminModel.js
const pool = require('../config/db'); // Adjust the path if necessary

// Function to get admin by admin_id
const getAdminById = async (adminId) => {
    try {
        const [rows] = await pool.query('SELECT * FROM admins WHERE admin_id = ?', [adminId]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching admin from DB:', error);
        throw error;
    }
};

// Function to add a subject to the database
const addSubject = async (subjectData) => {
    const { regulation, department, semester, total_subjects, total_credits, subject_code, subject_name, credits } = subjectData;

    try {
        await pool.query(
            `INSERT INTO subjects (regulation, department, semester, total_subjects, total_credits, subject_code, subject_name, credits)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [regulation, department, semester, total_subjects, total_credits, subject_code, subject_name, credits]
        );
    } catch (error) {
        console.error('Error inserting subject into DB:', error);
        throw error;
    }
};

// Function to fetch subjects based on regulation, department, and semester
const getSubjectsByCriteria = async (regulation, department, semester) => {
    try {
        const [subjects] = await pool.query(
            `SELECT id, subject_code, subject_name, credits 
             FROM subjects 
             WHERE regulation = ? AND department = ? AND semester = ?`,
            [regulation, department, parseInt(semester)]
        );
        return subjects;
    } catch (error) {
        console.error('Error fetching subjects from DB:', error);
        throw error;
    }
};

// Function to update a subject by ID
const updateSubject = async (subjectId, subjectDetails) => {
    const { subject_code, subject_name, credits } = subjectDetails;
    try {
        await pool.execute(
            'UPDATE subjects SET subject_code = ?, subject_name = ?, credits = ? WHERE id = ?',
            [subject_code, subject_name, credits, subjectId]
        );
    } catch (error) {
        console.error('Error updating subject:', error);
        throw error;
    }
};

// Function to delete a subject by ID
const deleteSubject = async (subjectId) => {
    try {
        await pool.execute('DELETE FROM subjects WHERE id = ?', [subjectId]);
    } catch (error) {
        console.error('Error deleting subject:', error);
        throw error;
    }
};

// Function to add a student to the database
const addStudent = async (studentData) => {
    const { name, rollNo, registerNo, department, year, className, mobileNo, email, password } = studentData;

    try {
        const result = await pool.query(
            `INSERT INTO students (name, roll_no, register_no, department, year, class, mobile_no, email, password)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, rollNo, registerNo, department, year, className, mobileNo, email, password]
        );
        return result.insertId; // Return the newly created student's ID
    } catch (error) {
        console.error('Error inserting student into DB:', error);
        throw error;
    }
};

// Function to find a student by unique fields
const findStudentByUniqueFields = async (rollNo, registerNo, email, mobileNo) => {
    const query = `
        SELECT * FROM students 
        WHERE roll_no = ? OR register_no = ? OR email = ? OR mobile_no = ?
    `;
    const [results] = await pool.query(query, [rollNo, registerNo, email, mobileNo]);
    return results.length > 0 ? results[0] : null; // Return the student if found
};


// Function to search students based on category and query
const searchStudents = async (category, query) => {
    try {
        const validCategoryColumns = {
            name: 'name',
            roll_no: 'roll_no',
            register_no: 'register_no',
            email: 'email',
            mobile_no: 'mobile_no'
        };

        const column = validCategoryColumns[category];
        if (!column) {
            throw new Error('Invalid search category');
        }

        const searchQuery = `
            SELECT 
                id, name, roll_no AS rollNo, register_no AS registerNo, 
                department, year, class, mobile_no AS mobileNo, email
            FROM 
                students
            WHERE 
                ?? LIKE ?`;

        const [results] = await pool.query(searchQuery, [column, `%${query}%`]);

        console.log("Search results:", results);  // Debugging line to check fetched data

        return results;
    } catch (error) {
        console.error('Error searching students in DB:', error);
        throw error;
    }
};





module.exports = {
    getAdminById,
    addSubject,
    getSubjectsByCriteria,
    updateSubject,
    deleteSubject,
    addStudent,
    findStudentByUniqueFields,
    searchStudents, 
};
