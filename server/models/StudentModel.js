const pool = require('../config/db'); // Assuming you have a pool connection set up

// Function to find a student by Roll No
const findStudentByRollNo = async (rollNo) => {
    const query = `SELECT * FROM students WHERE roll_no = ?`;
    const [results] = await pool.query(query, [rollNo]);
    return results.length > 0 ? results[0] : null; // Return student if found
};

// Function to get student data by ID
const getStudentById = async (studentId) => {
    const [student] = await pool.query('SELECT * FROM students WHERE id = ?', [studentId]);
    return student;
};

// Function to fetch subjects based on regulation, department, and semester
const fetchSubjectsByRegulationDepartmentAndSemester = async (regulation, department, semester) => {
    const query = `SELECT * FROM subjects WHERE regulation = ? AND department = ? AND semester = ? ORDER BY semester`;
    const [results] = await pool.query(query, [regulation, department, semester]); // Include semester in the query
    return results; // Return matching subjects for the specified semester
};

// Function to search for elective subjects by subject code
const searchElectiveSubject = async (subject_code) => {
    const query = `SELECT * FROM elective_subjects WHERE subject_code = ?`;
    const [results] = await pool.query(query, [subject_code]);
    return results;
};

// Function to insert a single student subject data
const saveStudentSubject = async (subjectDetails) => {
    const insertQuery = `
        INSERT INTO student_subjects (student_id, semester, subject_code, subject_name, grade, total_credits, total_grade_points)
        VALUES (?, ?, ?, ?, ?, ?, ?);`;

    // Ensure subjectDetails is in the correct order and data types
    await pool.query(insertQuery, subjectDetails);
};

// Function to fetch subjects for a specific student and semester
const getSubjectsBySemester = async (studentId, semester) => {
    const query = `
        SELECT subject_code, subject_name, grade, total_credits 
        FROM student_subjects 
        WHERE student_id = ? AND semester = ?
    `;
    const [results] = await pool.query(query, [studentId, semester]);
    return results;
};


// Function to update a student subject by subject_code and update total_grade_points
const updateStudentSubject = async (subjectCode, grade) => {
  const gradePointMap = {
      'O': 10,
      'A+': 9,
      'A': 8,
      'B+': 7,
      'B': 6,
      'C': 5,
      'D': 4,
      'U': 0,
  };

  const gradePoints = gradePointMap[grade];

  // Update grade and total_grade_points in the database
  const updateQuery = `
      UPDATE student_subjects 
      SET grade = ?, total_grade_points = total_credits * ?
      WHERE subject_code = ?;`;
  
  const [result] = await pool.query(updateQuery, [grade, gradePoints, subjectCode]);
  return result;
};


// Function to delete a student subject by subject_code
const deleteStudentSubject = async (subjectCode) => {
    const deleteQuery = `DELETE FROM student_subjects WHERE subject_code = ?;`;  // Delete by subject_code
    const [result] = await pool.query(deleteQuery, [subjectCode]);
    return result;
};

// Function to get calculated GPA by student ID
const getCalculatedGPAByStudentId = async (studentId) => {
  const query = `
      SELECT semester, 
             ROUND(SUM(total_grade_points) / SUM(total_credits), 3) AS calculatedGPA
      FROM student_subjects
      WHERE student_id = ?
      GROUP BY semester;
  `;

  const [results] = await pool.execute(query, [studentId]);
  return results;
};

// Function to insert or update CGPA for a student
const upsertCGPA = async (studentId, cgpa) => {
  const [result] = await pool.query(
    'INSERT INTO cgpa (student_id, cgpa) VALUES (?, ?) ON DUPLICATE KEY UPDATE cgpa = ?',
    [studentId, cgpa, cgpa]
  );
  return result;
};



// Home


const getStudentProfileById = async (student_id) => {
    try {
      const [students] = await pool.query(
        'SELECT name, roll_no, register_no, department, year, class, mobile_no, email FROM students WHERE id = ?',
        [student_id]
      );
      return students.length > 0 ? students[0] : null;
    } catch (error) {
      throw new Error('Database query failed');
    }
  };


  const getCGPAByStudentId = async (student_id) => {
    try {
      const [result] = await pool.query('SELECT cgpa FROM cgpa WHERE student_id = ?', [student_id]);
      return result.length > 0 ? result[0].cgpa : null; // Return CGPA if found, otherwise null
    } catch (error) {
      throw new Error('Database query failed');
    }
  };
  
  



module.exports = {
    findStudentByRollNo,
    getStudentById,
    fetchSubjectsByRegulationDepartmentAndSemester,
    searchElectiveSubject,
    saveStudentSubject,
    getSubjectsBySemester,
    updateStudentSubject,
    deleteStudentSubject,
    getCalculatedGPAByStudentId,
    upsertCGPA,
    getStudentProfileById,
    getCGPAByStudentId,
};
