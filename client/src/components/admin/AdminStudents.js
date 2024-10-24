import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../../auth/connection';
import '../../styles/admin/AdminStudents.css';

const AdminStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchCategory, setSearchCategory] = useState('name');
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');

  const handleAddStudentsClick = () => {
    navigate('/admin/dashboard/students/addstudents');
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSearchCategory(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    try {
      const response = await axios.get(`${baseURL}/admin/students/search`, {
        params: { category: searchCategory, query: searchInput },
      });
      setStudents(response.data); // Assuming the response contains the list of students
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students. Please try again.'); // Set error message
    }
  };

  return (
    <div className="admin-students-container">
      <div className="add-student-btn-container">
        <button onClick={handleAddStudentsClick} className="add-student-button">
          Add Students
        </button>
      </div>

      <h2 className="search-heading">Search Students</h2>
      <form onSubmit={handleSearchSubmit} className="search-container">
        <div className="form-group-category">
          <label htmlFor="searchCategory">Category:</label>
          <select
            className="search-category"
            id="searchCategory"
            value={searchCategory}
            onChange={handleCategoryChange}
          >
            <option value="name">Name</option>
            <option value="roll_no">Roll No</option>
            <option value="register_no">Register No</option>
            <option value="email">Email</option>
            <option value="mobile_no">Mobile No</option>
          </select>
        </div>

        <div className="form-group-search">
          <label htmlFor="searchInput">Search:</label>
          <input
            type="text"
            className="search-input"
            id="searchInput"
            placeholder="Enter search term..."
            value={searchInput}
            onChange={handleSearchChange}
          />
        </div>

        <button type="submit" className="search-button">Search</button>
      </form>

      {/* Display error message if any */}
      {error && <p className="error-message">{error}</p>}

      {/* Display fetched student details */}
      <div className="student-results">
        {students.length > 0 ? (
          students.map((student) => (
            <div key={student.id} className="student-card">
              <h3>{student.name}</h3>
              <p>Roll No: {student.rollNo}</p> {/* Updated */}
              <p>Register No: {student.registerNo}</p> {/* Updated */}
              <p>Department: {student.department}</p>
              <p>Year: {student.year}</p>
              <p>Class: {student.class}</p>
              <p>Email: {student.email}</p>
              <p>Mobile No: {student.mobileNo}</p> {/* Updated */}
            </div>
          ))
        ) : (
          <p>No students found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminStudents;
