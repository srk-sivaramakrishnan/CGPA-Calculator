import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import baseURL from '../../auth/connection';
import '../../styles/student/AddGPA.css';

const AddGPA = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [selectedRegulation, setSelectedRegulation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [subjectsBySemester, setSubjectsBySemester] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [addedSubjects, setAddedSubjects] = useState([]);
  const [grades, setGrades] = useState({});
  const [subjectsShown, setSubjectsShown] = useState(false);
  const [gradesSaved, setGradesSaved] = useState(false);

  const handleShowSubjects = async () => {
    setMessage({ text: '', type: '' });
    setGradesSaved(false);
    try {
      const response = await axios.post(`${baseURL}/student/subjects`, {
        regulation: selectedRegulation,
        department: selectedDepartment,
        semester: selectedSemester,
      });
      setSubjectsBySemester(response.data.subjectsBySemester);
      setSubjectsShown(true);
    } catch (error) {
      displayMessage(error.response?.data?.error || 'There are no subjects for this semester, regulation, or department.', 'error');
    }
  };

  const displayMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' }); // Clear message after 2 seconds
    }, 2000);
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      try {
        const response = await axios.get(`${baseURL}/student/electives/search`, {
          params: { subject_code: term },
        });
        setFilteredSubjects(response.data);
      } catch (error) {
        setFilteredSubjects([]);
      }
    } else {
      setFilteredSubjects([]);
    }
  };

  const handleAddSubjects = () => {
    if (selectedSemester && addedSubjects.length > 0) {
      setSubjectsBySemester((prev) => {
        const updatedSubjects = { ...prev };
        if (!updatedSubjects[selectedSemester]) {
          updatedSubjects[selectedSemester] = [];
        }
        updatedSubjects[selectedSemester] = [
          ...updatedSubjects[selectedSemester],
          ...addedSubjects,
        ];
        return updatedSubjects;
      });
      displayMessage(`Successfully added subjects to Semester ${selectedSemester}!`, 'success');
      setIsModalOpen(false);
      setAddedSubjects([]);
      setSearchTerm('');
      setFilteredSubjects([]);
    } else {
      displayMessage('Please select a semester and at least one subject to add.', 'error');
    }
  };

  const handleSelectSubject = (subject) => {
    if (!addedSubjects.some((s) => s.id === subject.id)) {
      setAddedSubjects((prev) => [...prev, subject]);
    }
  };

  const handleGradeChange = (subjectId, grade) => {
    setGrades((prev) => ({
      ...prev,
      [subjectId]: grade,
    }));
  };

  const handleSaveGrades = async () => {
    const subjectsToSave = subjectsBySemester[selectedSemester].map((subject) => {
      const grade = grades[subject.id];
      const totalCredits = Number(subject.credits) || 0;

      return {
        student_id: id,
        semester: selectedSemester,
        subject_code: subject.subject_code,
        subject_name: subject.subject_name,
        total_credits: totalCredits,
        grade,
      };
    });

    try {
      await axios.post(`${baseURL}/student/subjects/store/${id}`, {
        subjects: subjectsToSave,
      });
      displayMessage('Subjects and grades saved successfully!', 'success');
      setGradesSaved(true);
    } catch (error) {
      displayMessage(error.response?.data?.error || 'Fill the incomplete grade.', 'error');
    }
  };

  // New handleBack function to navigate back to the previous page
  const handleBack = () => {
    navigate(`/student/dashboard/${id}/gpa`);
  };

  return (
    <div className="gpa-container">
      <h2>Add Grades</h2>

      {/* Display Back Button */}
      <button className="back-button" onClick={handleBack}>
        <i className="fas fa-arrow-left"></i> Back
      </button>

      {/* Display message */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="input-section">
        <div className="input-group">
          <label>Regulation:</label>
          <select value={selectedRegulation} onChange={(e) => setSelectedRegulation(e.target.value)}>
            <option value="">Select Regulation</option>
            <option value="2017">2017</option>
            <option value="2021">2021</option>
          </select>
        </div>
        <div className="input-group">
          <label>Department:</label>
          <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="Mech">Mechanical</option>
            <option value="Civil">Civil</option>
          </select>
        </div>
        <div className="input-group">
          <label>Semester:</label>
          <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
            <option value="">Select Semester</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>
      </div>

      <div className="button-container">
        <button onClick={handleShowSubjects}>Show Subjects</button>
        {(selectedSemester === '5' || selectedSemester === '6' || selectedSemester === '7' || selectedSemester === '8') && subjectsShown && (
          <button onClick={() => setIsModalOpen(true)}>Add Subjects</button>
        )}
      </div>

      <div className="subjects-container">
        {Object.keys(subjectsBySemester).length > 0 ? (
          Object.keys(subjectsBySemester).map((semester) => (
            <div key={semester} className="semester-section">
              <h3>Semester {semester}</h3>
              {subjectsBySemester[semester].map((subject) => (
                <div key={subject.id} className="subject-item">
                  <div className="subject-info">
                    <span className="subject-name">{subject.subject_name}</span>
                    <span className="subject-code">{subject.subject_code}</span>
                  </div>
                  <select className="grade-dropdown" onChange={(e) => handleGradeChange(subject.id, e.target.value)} defaultValue="">
                    <option value="">Select Grade</option>
                    <option value="O">O</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="U">U</option>
                  </select>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No subjects available for the selected semester.</p>
        )}
      </div>

      {subjectsShown && !gradesSaved && (
        <div className="save-button-container">
          <button onClick={handleSaveGrades}>Save Grades</button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <h2>Add Elective Subjects</h2>
          <input
            type="text"
            placeholder="Search by Subject Code"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="filtered-subjects">
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject) => (
                <div key={subject.id} className="subject-item" onClick={() => handleSelectSubject(subject)}>
                  {subject.subject_name} (Code: {subject.subject_code})
                </div>
              ))
            ) : (
              <p>No subjects found.</p>
            )}
          </div>
          <button onClick={handleAddSubjects}>Add Selected Subjects</button>
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default AddGPA;
