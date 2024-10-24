import React, { useState, useEffect } from 'react';
import baseURL from '../../auth/connection'; // Import the base URL
import '../../styles/admin/AddCredits.css'; // Import your custom styles for AddCredits

const AddCredits = () => {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRegulation, setSelectedRegulation] = useState('');
  const [numOfSubjects, setNumOfSubjects] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [totalCredits, setTotalCredits] = useState(0); // State for total credits

  useEffect(() => {
    // Calculate total credits whenever subjects change
    const total = subjects.reduce((sum, subject) => {
      return sum + (parseFloat(subject.credits) || 0); // Use parseFloat to handle both integers and decimals
    }, 0);
    setTotalCredits(total);
  }, [subjects]);
  

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleRegulationChange = (event) => {
    setSelectedRegulation(event.target.value);
  };

  const handleNumOfSubjectsChange = (event) => {
    const number = parseInt(event.target.value);
    setNumOfSubjects(number);
    setSubjects(Array.from({ length: number }, () => ({ code: '', name: '', credits: '' })));
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const handleAddClick = () => {
    setShowModal(true); // Show the modal when Add button is clicked
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleConfirm = async () => {
    // Validate inputs
    const hasEmptyFields = subjects.some(subject => 
        !subject.code || !subject.name || !subject.credits
    );

    // Additional validation for regulation, department, and semester
    if (!selectedRegulation || !selectedDepartment || !selectedSemester) {
        alert("Please fill in Regulation, Department, and Semester.");
        return; // Prevent submission if fields are empty
    }

    if (hasEmptyFields) {
        alert("Please fill in all subject fields.");
        return; // Prevent submission if subject fields are empty
    }

    // Calculate total subjects
    const totalSubjects = subjects.length; // This is simply the number of subjects

    const subjectData = {
        regulation: selectedRegulation,
        department: selectedDepartment,
        semester: selectedSemester,
        total_subjects: totalSubjects,
        total_credits: totalCredits,
        subjects: subjects,
    };

    try {
        const response = await fetch(`${baseURL}/admin/addsubjects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subjectData),
        });

        if (!response.ok) {
            throw new Error('Failed to add subjects');
        }

        const result = await response.json();
        console.log('Subjects added successfully:', result);
        setShowModal(false); // Close the modal after confirmation
        resetForm(); // Reset form after successful submission
    } catch (error) {
        console.error('Error adding subjects:', error);
    }
  };

  const resetForm = () => {
    setSelectedSemester('');
    setSelectedDepartment('');
    setSelectedRegulation('');
    setNumOfSubjects(0);
    setSubjects([]);
    setTotalCredits(0);
  };

  const handleCancel = () => {
    setShowModal(false); // Close the modal without any action
  };

  return (
    <div className="add-credits-container">
      <h2>Select Regulation:</h2>
      <select value={selectedRegulation} onChange={handleRegulationChange} className="dropdown">
        <option value="" disabled>Select Regulation</option>
        {['2021', '2025'].map((regulation) => (
          <option key={regulation} value={regulation}>
            Regulation - {regulation}
          </option>
        ))}
      </select>

      <h2>Select Department:</h2>
      <select value={selectedDepartment} onChange={handleDepartmentChange} className="dropdown">
        <option value="" disabled>Select Department</option>
        {['CSE', 'IT', 'CSBS', 'AI&DS', 'ECE', 'MECH', 'S&H', 'CYS'].map((department) => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </select>

      <h2>Select Semester:</h2>
      <select value={selectedSemester} onChange={handleSemesterChange} className="dropdown">
        <option value="" disabled>Select Semester</option>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
          <option key={semester} value={semester}>
            Semester {semester}
          </option>
        ))}
      </select>

      <h2>No. of Subjects:</h2>
      <input
        type="number"
        value={numOfSubjects}
        onChange={handleNumOfSubjectsChange}
        className="subject-input"
        min="0"
      />

      {numOfSubjects > 0 && (
        <>
          <h2>Enter your Subject Code, Subject Name, and Credits:</h2>
          {subjects.map((subject, index) => (
            <div key={index} className="input-group">
              <input
                type="text"
                placeholder="Subject Code"
                value={subject.code}
                onChange={(e) => handleSubjectChange(index, 'code', e.target.value)}
                className="subject-input"
              />
              <input
                type="text"
                placeholder="Subject Name"
                value={subject.name}
                onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                className="subject-input"
              />
              <input
                type="number"
                placeholder="Credits"
                value={subject.credits}
                onChange={(e) => handleSubjectChange(index, 'credits', e.target.value)}
                className="credit-input"
              />
            </div>
          ))}
        </>
      )}

      <button className="add-button" onClick={handleAddClick}>Add</button>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h3>Summary of Inputs</h3>
            <p><strong>Regulation:</strong> {selectedRegulation}</p>
            <p><strong>Department:</strong> {selectedDepartment}</p>
            <p><strong>Semester:</strong> {selectedSemester}</p>
            <p><strong>Total No of Subjects:</strong> {numOfSubjects}</p>
            <p><strong>Total Credits:</strong> {totalCredits}</p> {/* Display total credits */}
            <div className="added-credits-list">
              {subjects.map((subject, index) => (
                <div key={index} className="added-credit-card">
                  <p><strong>Subject Code:</strong> {subject.code}</p>
                  <p><strong>Subject Name:</strong> {subject.name}</p>
                  <p><strong>Credits:</strong> {subject.credits}</p>
                </div>
              ))}
            </div>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleConfirm}>Confirm</button>
              <button className="cancel-button" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="added-data-container">
        {/* Render added subjects here */}
      </div>
    </div>
  );
};

export default AddCredits;
