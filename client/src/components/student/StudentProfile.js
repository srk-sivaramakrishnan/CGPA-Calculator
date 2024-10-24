import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import baseURL from '../../auth/connection';
import '../../styles/student/StudentProfile.css';

const StudentProfile = () => {
  const { id: student_id } = useParams();

  const [studentDetails, setStudentDetails] = useState({
    name: '',
    roll_no: '',
    register_no: '',
    department: '',
    year: '',
    class: '',
    mobile_no: '',
    email: '',
    cgpa: ''
  });

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const studentResponse = await axios.get(`${baseURL}/student/profile/${student_id}`);
        setStudentDetails(prevDetails => ({ ...prevDetails, ...studentResponse.data }));

        const cgpaResponse = await axios.get(`${baseURL}/student/profile/cgpa/${student_id}`);
        setStudentDetails(prevDetails => ({
          ...prevDetails,
          cgpa: cgpaResponse.data.cgpa || 'CGPA not available'
        }));
      } catch (error) {
        console.error('Error fetching student details or CGPA:', error);
      }
    };

    fetchStudentDetails();
  }, [student_id]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = studentDetails.name || 'Student';
    let greetingText = '';

    if (hour < 12) greetingText = `Good Morning, `;
    else if (hour < 17) greetingText = `Good Afternoon, `;
    else if (hour < 21) greetingText = `Good Evening, `;
    else greetingText = `Good Night, `;

    return { greetingText, name };
  };

  const { greetingText, name } = getGreeting();

  return (
    <div className="student-home-container">
      <div className="header">
        <h2 className="profile-heading">Student Profile</h2>
      </div>
      <h2 className="greeting">
        <span>{greetingText}</span>
        <span className="name">{name}</span>
      </h2>

      <div className="profile-container">
        <img 
          src="/profile-img.png" 
          alt="Profile" 
          className="profile-picture"
        />
      </div>

      <div className="details-container">
        <p><strong>Name:</strong> <span className="student-detail-value">{studentDetails.name}</span></p>
        <p><strong>Roll Number:</strong> <span className="student-detail-value">{studentDetails.roll_no}</span></p>
        <p><strong>Register Number:</strong> <span className="student-detail-value">{studentDetails.register_no}</span></p>
        <p><strong>Department:</strong> <span className="student-detail-value">{studentDetails.department}</span></p>
        <p><strong>Year:</strong> <span className="student-detail-value">{studentDetails.year}</span></p>
        <p><strong>Class:</strong> <span className="student-detail-value">{studentDetails.class}</span></p>
        <p><strong>Mobile Number:</strong> <span className="student-detail-value">{studentDetails.mobile_no}</span></p>
        <p><strong>Email:</strong> <span className="student-detail-value">{studentDetails.email}</span></p>
        <p><strong>CGPA:</strong> <span className="student-detail-value">{studentDetails.cgpa}</span></p>
      </div>
    </div>
  );
};

export default StudentProfile;
