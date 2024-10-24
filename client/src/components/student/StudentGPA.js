import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import baseURL from '../../auth/connection';
import '../../styles/student/StudentGPA.css';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

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

const StudentGPA = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [semesters] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [newGrade, setNewGrade] = useState('');
  const [gpa, setGpa] = useState(null);
  // Message state for success/error notifications
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchSubjects = async (semester) => {
    try {
      const response = await axios.get(`${baseURL}/student/subjects/${id}/semester/${semester}`);
      console.log('Fetched subjects:', response.data);
      setSubjects(response.data);
      setSelectedSemester(semester);
      calculateGPA(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const calculateGPA = (subjects) => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    subjects.forEach((subject) => {
      const grade = subject.grade;
      const gradePoints = gradePointMap[grade];
      const credits = subject.total_credits;

      if (gradePoints !== undefined && credits) {
        totalGradePoints += gradePoints * credits;
        totalCredits += parseFloat(credits);
      }
    });

    if (totalCredits > 0) {
      const calculatedGPA = (totalGradePoints / totalCredits).toFixed(3);
      setGpa(calculatedGPA);
    } else {
      setGpa(null);
    }
  };

  const handleAddCalculateGPA = () => {
    navigate(`/student/dashboard/${id}/gpa/addgpa`);
  };

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setNewGrade(subject.grade);
    setShowModal(true);
  };

  const handleDelete = async (subjectCode) => {
    try {
      await axios.delete(`${baseURL}/student/subjects/delete/${subjectCode}`);
      const updatedSubjects = subjects.filter(subject => subject.subject_code !== subjectCode);
      setSubjects(updatedSubjects);
      calculateGPA(updatedSubjects);
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const handleUpdateGrade = async () => {
    if (selectedSubject && selectedSubject.subject_code) {
      try {
        const response = await axios.put(`${baseURL}/student/subjects/${selectedSubject.subject_code}`, {
          grade: newGrade,
        });

        if (response.status === 200) {
          const updatedSubjects = subjects.map(subject => {
            if (subject.subject_code === selectedSubject.subject_code) {
              return { ...subject, grade: newGrade };
            }
            return subject;
          });
          setSubjects(updatedSubjects);
          calculateGPA(updatedSubjects);
          setShowModal(false);
          // Set success message
          setMessage({ text: 'Grade updated successfully!', type: 'success' });
        } else {
          // Set error message
          setMessage({ text: 'Failed to update subject. Please try again.', type: 'error' });
        }
      } catch (error) {
        console.error('Error updating grade:', error.response || error.message);
        // Set error message
        setMessage({ text: 'Error updating grade. Please try again.', type: 'error' });
      }

      // Clear the message after 2 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 2000);
    } else {
      console.error('Selected subject is undefined or does not have a valid subject_code.');
    }
  };

  return (
    <div className="gpa-container">
      {/* Display message */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      <div className="header">
        <h2 className="title">GPA Calculation</h2>
        <button onClick={handleAddCalculateGPA} className="add-gpa-button">
          Add GPA
        </button>
      </div>

      <div className="semester-container">
        <select
          onChange={(e) => fetchSubjects(e.target.value)}
          value={selectedSemester || ""}
        >
          <option value="" disabled>Select a Semester</option>
          {semesters.map((semester) => (
            <option key={semester} value={semester}>
              Semester {semester}
            </option>
          ))}
        </select>
      </div>

      {gpa !== null && (
        <div className="gpa-result fetching-color">
          <h3>
            Calculated GPA for Semester {selectedSemester}: <span className="subject-value">{gpa}</span>
          </h3>
        </div>
      )}

      {selectedSemester && (
        <div className='sem-heading'>
          <h3>Subjects for Semester <span className="subject-value">{selectedSemester}</span></h3>
        </div>
      )}

      <div className="subject-container">
        {subjects.length > 0 ? (
          subjects.map((subject, index) => (
            <div className="subject-box" key={index}>
              <div className="subject-info">
                <p><strong>Subject Code:</strong> <span className="subject-value">{subject.subject_code}</span></p>
                <p><strong>Subject Name:</strong> <span className="subject-value">{subject.subject_name}</span></p>
                <p><strong>Grade:</strong> <span className="subject-value">{subject.grade}</span></p>
                <p><strong>Credits:</strong> <span className="subject-value">{subject.total_credits}</span></p>
              </div>
              <div className="subject-actions">
                <FaEdit onClick={() => handleEdit(subject)} className="edit-icon" />
                <FaTrash onClick={() => handleDelete(subject.subject_code)} className="delete-icon" />
              </div>
            </div>
          ))
        ) : (
          <p>No subjects found for this semester.</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Grade</h3>
            <select value={newGrade} onChange={(e) => setNewGrade(e.target.value)}>
              <option value="">Select Grade</option>
              {Object.keys(gradePointMap).map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
            <button onClick={handleUpdateGrade}>Update</button>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );  
};

export default StudentGPA;
