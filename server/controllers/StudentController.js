const bcrypt = require('bcrypt');
const studentModel = require('../models/StudentModel');

// Student login
exports.studentLogin = async (req, res) => {
    const { rollNo, password } = req.body;

    try {
        // Find student by roll number
        const student = await studentModel.findStudentByRollNo(rollNo);
        if (!student) {
            return res.status(400).json({ error: 'Student not found.' });
        }

        // Compare password with bcrypt
        const passwordMatch = await bcrypt.compare(password, student.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password.' });
        }

        // If login is successful, return the student ID and a success message
        res.status(200).json({ message: 'Login successful', id: student.id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
};

// Controller function to get student data by ID
exports.getStudentById = async (req, res) => {
    const studentId = req.params.id;

    try {
        // Use the model to fetch student data
        const student = await studentModel.getStudentById(studentId);

        // Check if student exists
        if (student.length === 0) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.json(student[0]); // Send back the student data
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.status(500).json({ error: 'Failed to fetch student data.' });
    }
};

// Fetching subjects grouped by semester
exports.fetchSubjects = async (req, res) => {
    const { regulation, department, semester } = req.body; // Include semester

    try {
        const subjects = await studentModel.fetchSubjectsByRegulationDepartmentAndSemester(regulation, department, semester); // Adjusted function call

        if (subjects.length === 0) {
            return res.status(404).json({ message: 'No subjects found for the selected semester.' });
        }

        // Group subjects by semester (this may not be necessary if you're only fetching for one semester)
        const subjectsBySemester = subjects.reduce((acc, subject) => {
            if (!acc[subject.semester]) {
                acc[subject.semester] = [];
            }
            acc[subject.semester].push(subject);
            return acc;
        }, {});

        res.status(200).json({ subjectsBySemester });
    } catch (error) {
        console.error('Fetch subjects error:', error);
        res.status(500).json({ error: 'An error occurred while fetching subjects.' });
    }
};

// Search elective subjects by subject code
exports.searchElectiveSubject = async (req, res) => {
    const { subject_code } = req.query;

    try {
        const result = await studentModel.searchElectiveSubject(subject_code);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error('Search elective error:', error);
        res.status(500).json({ error: 'Error fetching elective subject' });
    }
};

// Save student subjects
exports.saveStudentSubjects = async (req, res) => {
    const student_id = req.params.id; // Get student ID from URL parameters
    const subjects = req.body.subjects; // Receive an array of subjects

    try {
        // Fetch student data from the students table
        const student = await studentModel.getStudentById(student_id);
        if (!student) {
            return res.status(404).send({ error: 'Student not found.' });
        }

        // Insert each subject into the student_subjects table
        for (const subject of subjects) {
            const { semester, subject_code, subject_name, grade, total_credits } = subject;

            // Calculate total grade points based on grade and credits
            const gradePoints = getGradePoints(grade); // Ensure gradePoints returns the correct value
            const totalGradePoints = gradePoints * total_credits; // Calculate total grade points for the subject

            // Prepare data for insertion
            const subjectDetails = [
                student_id,
                semester,
                subject_code,
                subject_name,
                grade,
                total_credits,
                totalGradePoints // Store total grade points calculated
            ];

            // Insert into student_subjects table
            await studentModel.saveStudentSubject(subjectDetails);
        }

        res.status(201).send({ message: 'Subjects saved successfully.' });
    } catch (error) {
        console.error('Error saving subjects:', error);
        res.status(500).send({ error: 'Failed to save subjects.' });
    }
};

// Function to get grade points based on the grade
const getGradePoints = (grade) => {
    switch (grade) {
        case 'O': return 10;
        case 'A+': return 9;
        case 'A': return 8;
        case 'B+': return 7; // Ensure this returns 7 correctly
        case 'B': return 6;
        case 'C': return 5;
        case 'U': return 0; // Unsatisfactory
        default: return 0; // In case of an invalid grade
    }
};

// Fetch subjects for a specific student and semester
exports.getSubjectsBySemester = async (req, res) => {
    const studentId = req.params.id; // Get student ID from URL parameters
    const { semester } = req.params; // Get semester from URL parameters

    try {
        const subjects = await studentModel.getSubjectsBySemester(studentId, semester);

        if (subjects.length === 0) {
            return res.status(404).json({ message: 'No subjects found for the selected semester.' });
        }

        res.status(200).json(subjects); // Return the fetched subjects
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Failed to fetch subjects.' });
    }
};

// Edit a student subject by subject_code
exports.editStudentSubject = async (req, res) => {
    const subjectCode = req.params.subject_code;
    const { grade } = req.body;

    try {
        const result = await studentModel.updateStudentSubject(subjectCode, grade); // Pass subject_code
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Subject not found.' });
        }
        res.status(200).json({ message: 'Student subject updated successfully.' });
    } catch (error) {
        console.error('Error updating student subject:', error);
        res.status(500).json({ error: 'Failed to update student subject.' });
    }
};


// Delete a student subject by subject_code
exports.deleteStudentSubject = async (req, res) => {
    const subjectCode = req.params.subject_code; // Use subject_code

    try {
        const result = await studentModel.deleteStudentSubject(subjectCode); // Pass subject_code
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Subject not found.' });
        }
        res.status(200).json({ message: 'Student subject deleted successfully.' });
    } catch (error) {
        console.error('Error deleting student subject:', error);
        res.status(500).json({ error: 'Failed to delete student subject.' });
    }
};

// Controller function to get calculated GPA for a student
exports.getCalculatedGPA = async (req, res) => {
    const { id } = req.params; // Get student ID from URL parameters

    try {
        const gpaData = await studentModel.getCalculatedGPAByStudentId(id); // Fetch GPA data from model
        res.status(200).json(gpaData); // Send GPA data as response
    } catch (error) {
        console.error('Error fetching calculated GPA:', error);
        res.status(500).json({ message: 'Server error' }); // Handle errors
    }
};

// Controller to save semester and GPA
exports.saveSemesterGPA = async (req, res) => {
    const semesterGPAData = req.body; // This will be an array of GPA data
  
    try {
        const results = [];
        
        for (const item of semesterGPAData) {
            const { student_id, semester, gpa } = item; // Destructure the item
  
            // Call the model function to insert or update the GPA for the specified semester
            const result = await studentModel.saveStudentSemesterGPA(student_id, semester, gpa);
            results.push(result); // Collect results if needed
        }
  
        res.status(200).json({ message: 'Semester GPAs saved successfully', results });
    } catch (error) {
        console.error('Error saving semester GPA:', error);
        res.status(500).json({ error: 'Failed to save semester GPA.' });
    }
};

// Controller to save CGPA
exports.saveCGPA = async (req, res) => {
    const { student_id, cgpa } = req.body;
  
    try {
        // Ensure the CGPA is updated correctly
        const result = await studentModel.upsertCGPA(student_id, cgpa);
        res.status(200).json({ message: 'CGPA updated successfully', id: result.insertId });
    } catch (error) {
        console.error('Failed to save CGPA:', error);
        res.status(500).json({ message: 'Failed to save CGPA', error });
    }
};

 // Home

 exports.getStudentDetails = async (req, res) => {
    const { student_id } = req.params; // This should now correctly receive the ID
    console.log('Student ID received:', student_id); // Log the student_id
  
    try {
      const student = await studentModel.getStudentProfileById(student_id);
  
      if (student) {
        res.status(200).json(student);
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      res.status(500).json({ message: 'Failed to fetch student details' });
    }
  };
  

// In your controller file
exports.getCGPAByStudentId = async (req, res) => {
    const { id } = req.params; // Use the correct parameter name
    console.log('Fetching CGPA for student_id:', id); // Debugging log
  
    try {
      const cgpa = await studentModel.getCGPAByStudentId(id);
      console.log('CGPA fetched:', cgpa); // Debugging log
  
      if (cgpa !== null) {
        res.status(200).json({ cgpa });
      } else {
        res.status(404).json({ message: 'CGPA not found' });
      }
    } catch (error) {
      console.error('Error fetching CGPA:', error);
      res.status(500).json({ message: 'Failed to fetch CGPA' });
    }
  };
  

// Function to change student password
exports.changePassword = async (req, res) => {
    const studentId = req.params.id; // Get student ID from URL parameters
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    try {
        // Fetch the student by ID
        const student = await studentModel.getStudentByIdPass(studentId);

        // Check if the student exists
        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        // Case 1: Password stored in plain text (legacy case)
        let passwordMatch;
        if (student.password.startsWith('$2b$')) {
            // Case 2: Password is already hashed, use bcrypt to compare
            passwordMatch = await bcrypt.compare(currentPassword, student.password);
        } else {
            // Compare plain-text password
            passwordMatch = (currentPassword === student.password);
        }

        // If current password does not match
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Current password is incorrect.' });
        }

        // Ensure newPassword and confirmNewPassword match
        if (!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
            return res.status(400).json({ error: 'New passwords do not match.' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database with the hashed password
        await studentModel.updateStudentPassword(studentId, hashedNewPassword);

        return res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ error: 'An error occurred while changing the password.' });
    }
};

// Controller to fetch CGPA data
exports.getAnalyticsData = async (req, res) => {
    const studentId = req.params.id; // Get student ID directly from URL

    try {
        // Fetch CGPA data
        const cgpaData = await studentModel.getStudentCGPAData(studentId);
        
        // Prepare data for the pie chart
        const totalCGPA = 10.00; // Set total CGPA constant
        const studentCGPA = cgpaData[0] ? parseFloat(cgpaData[0].cgpa).toFixed(2) : 0; // Fetch and round student's CGPA to 2 decimal places
        const remainingCGPA = (totalCGPA - studentCGPA).toFixed(2); // Calculate and format remaining CGPA to 2 decimal places

        // Create the data structure for the pie chart
        const pieChartData = [
            { name: 'Current CGPA', value: parseFloat(studentCGPA) }, // Student's CGPA
            { name: 'Remaining CGPA', value: parseFloat(remainingCGPA) } // Remaining CGPA
        ];

        res.status(200).json({ pieChartData });
    } catch (error) {
        console.error('Error fetching CGPA data:', error);
        res.status(500).json({ message: 'Failed to fetch CGPA data', error });
    }
};

// Controller to fetch U grade count
exports.getStudentArrear = async (req, res) => {
    const studentId = req.params.id; // Get student ID directly from URL

    try {
        // Fetch U grade count for the student
        const uGradeCount = await studentModel.getStudentUGradeCount(studentId);

        res.status(200).json({ uGradeCount });
    } catch (error) {
        console.error('Error fetching student U grade count:', error);
        res.status(500).json({ message: 'Failed to fetch U grade count', error });
    }
};


// Controller to fetch student's subjects
exports.getBacklogSubjects = async (req, res) => {
    const studentId = req.params.id; // Get student ID directly from URL

    try {
        // Fetch subjects for the student
        const subjects = await studentModel.getBacklogSubjects(studentId);

        if (subjects.length === 0) {
            return res.status(404).json({ message: 'No subjects found for this student.' });
        }

        // Respond with the subjects data
        res.status(200).json({ subjects });
    } catch (error) {
        console.error('Error fetching student subjects:', error);
        res.status(500).json({ message: 'Failed to fetch student subjects', error });
    }
};
