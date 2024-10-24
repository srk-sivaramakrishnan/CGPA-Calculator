import React, { useState } from 'react';
import '../../styles/admin/AddStudents.css'; // Create your own CSS file for styles
import baseURL from '../../auth/connection'; // Import the base URL
import axios from 'axios';

const AddStudents = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    registerNo: '',
    department: '',
    year: '',  // Keep it as string to store full year names
    className: '',
    mobileNo: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset previous errors

    try {
        const response = await axios.post(`${baseURL}/admin/students/add`, formData);
        console.log(response.data); // Handle success response

        // Optionally reset the form here
        setFormData({
            name: '',
            rollNo: '',
            registerNo: '',
            department: '',
            year: '',
            className: '',
            mobileNo: '',
            email: '',
            password: '',
        });
    } catch (error) {
        // Check for duplicate entry error
        if (error.response && error.response.data && error.response.data.error) {
            const { error: errorMsg } = error.response.data; // Destructure error message
            if (errorMsg.includes("already exists")) {
                setError(errorMsg); // Use the specific error message from the server
            } else {
                setError('Error adding student: ' + errorMsg);
            }
        } else {
            setError('Error adding student: ' + (error.response ? error.response.data : 'Unknown error'));
        }
        console.error('Error adding student:', error); // Handle error
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="add-students-wrapper">
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required id="name" />
        </div>

        <div className="form-group">
          <label htmlFor="rollNo">Roll No:</label>
          <input type="text" name="rollNo" value={formData.rollNo} onChange={handleInputChange} required id="rollNo" />
        </div>

        <div className="form-group">
          <label htmlFor="registerNo">Register No:</label>
          <input type="text" name="registerNo" value={formData.registerNo} onChange={handleInputChange} required id="registerNo" />
        </div>

        <div className="form-group">
          <div className="form-group-dropdown">
            <label htmlFor="department">Department:</label>
            <select name="department" value={formData.department} onChange={handleInputChange} required id="department">
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="Mech">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="form-group-dropdown">
            <label htmlFor="year">Year:</label>
            <select name="year" value={formData.year} onChange={handleInputChange} required id="year">
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="form-group-dropdown">
            <label htmlFor="className">Class:</label>
            <select name="className" value={formData.className} onChange={handleInputChange} required id="className">
              <option value="">Select Class</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              {/* Add more classes as needed */}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="mobileNo">Mobile No:</label>
          <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleInputChange} required id="mobileNo" />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required id="email" />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} required id="password" />
        </div>

        {error && <p className="error-message">{error}</p>}
        {loading && <p>Loading...</p>}
        
        <button type="submit" className="submit-button">Save</button>
      </form>
    </div>
  );
};

export default AddStudents;
