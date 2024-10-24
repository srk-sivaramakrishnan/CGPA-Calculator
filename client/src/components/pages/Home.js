import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to CGPA Management System</h1>
      <div className="button-container">
        <Link to="/admin/login" className="home-button">
          Admin Login
        </Link>
        <Link to="/student/login" className="home-button">
          Student Login
        </Link>
      </div>
    </div>
  );
}

export default Home;
