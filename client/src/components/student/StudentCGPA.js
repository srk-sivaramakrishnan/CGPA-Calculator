import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import baseURL from '../../auth/connection';
import axios from 'axios';
import '../../styles/student/StudentCGPA.css';

const StudentCGPA = () => {
  const { id } = useParams(); // Get student ID from the URL parameters
  const [gpaData, setGpaData] = useState([]); // State to hold GPA data
  const [loading, setLoading] = useState(true); // Loading state
  const [totalCGPA, setTotalCGPA] = useState(0); // State for total CGPA
  const [error, setError] = useState(null); // Error handling
  const [showTotalCGPA, setShowTotalCGPA] = useState(false); // State to manage Total CGPA visibility
  const [isGPAStored, setIsGPAStored] = useState(false); // State to manage button visibility

  useEffect(() => {
    const fetchGPAData = async () => {
      try {
        const response = await axios.get(`${baseURL}/student/gpa/${id}`); // Fetch GPA data from the backend
        setGpaData(response.data); // Set the GPA data
        calculateTotalCGPA(response.data); // Calculate total CGPA
      } catch (error) {
        setError('Failed to fetch GPA data'); // Error handling
      } finally {
        setLoading(false); // Update loading state
      }
    };

    fetchGPAData(); // Call the fetch function
  }, [id]); // Dependency array to call effect when student ID changes

  // Function to calculate total CGPA
  const calculateTotalCGPA = (data) => {
    const totalGPA = data.reduce((total, semesterData) => {
      const gpa = parseFloat(semesterData.calculatedGPA);
      return total + (isNaN(gpa) ? 0 : gpa);
    }, 0);
    const cgpa = data.length > 0 ? totalGPA / data.length : 0; // Avoid division by zero
    setTotalCGPA(cgpa.toFixed(2)); // Set total CGPA with two decimal places
  };

  // Submit updated GPA data
  const handleSubmit = async () => {
    try {
      const semesterGPAData = gpaData.map(data => ({
        student_id: id, // Include student ID
        semester: data.semester,
        gpa: data.calculatedGPA,
      }));
  
      await axios.post(`${baseURL}/student/semesterGPA/${id}`, semesterGPAData); // Update GPA data on the backend
      
      // After storing the GPA data, store the CGPA
      await axios.post(`${baseURL}/student/cgpa`, { student_id: id, cgpa: totalCGPA });

      setShowTotalCGPA(true); // Show Total CGPA after calculation
      setIsGPAStored(true); // Set GPA stored to true to hide the button
    } catch (error) {
      setError('Failed to calculate CGPA'); // Error handling
    }
  };

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>{error}</div>; // Show error message

  return (
    <div className="cgpa-container">
      <h2>Student CGPA</h2>
      <div className="gpa-box-container">
        {gpaData.length > 0 ? (
          gpaData.sort((a, b) => a.semester - b.semester).map((semesterData) => (
            <div key={semesterData.semester} className="gpa-box">
              <div className="gpa-box-content">
                <div className="semester-title">
                  <h3>Semester {semesterData.semester}</h3>
                </div>
                <div className="gpa-input-container">
                  <input
                    type="number"
                    value={parseFloat(semesterData.calculatedGPA).toFixed(3)} // Display GPA with three decimal places
                    readOnly // Makes input non-editable
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No GPA data available.</p>
        )}
      </div>
      {showTotalCGPA && ( // Conditionally render Total CGPA based on state
        <div className="cgpa-total">
          <h3>
            Total CGPA: <span className="cgpa-value">{totalCGPA}</span>
          </h3>
        </div>
      )}
      {!isGPAStored && ( // Hide button if GPA has been stored
        <button onClick={handleSubmit}>Calculate CGPA</button>
      )}
    </div>
  );
};

export default StudentCGPA;
