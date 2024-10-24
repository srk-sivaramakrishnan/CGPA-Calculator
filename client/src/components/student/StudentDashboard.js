import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faCalculator, faUser, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Link, Outlet, useParams } from 'react-router-dom';
import '../../styles/admin/AdminDashboard.css'; // Assuming you already have this CSS file

const StudentDashboard = () => {
  const [isOpen, setIsOpen] = useState(true); // Start with sidebar open
  const { id } = useParams(); // Get the student ID from the URL

  // Toggle sidebar open/close
  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Arrow Button */}
        <div className="arrow-button" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={isOpen ? faArrowLeft : faArrowRight} className="icon" />
        </div>

        <ul>
          <li>
            <Link to={`/student/dashboard/${id}/gpa`}>
              <FontAwesomeIcon icon={faChartBar} className="icon" />
              {isOpen && <span className="label">GPA</span>}
            </Link>
          </li>
          <li>
            <Link to={`/student/dashboard/${id}/cgpa`}>
              <FontAwesomeIcon icon={faCalculator} className="icon" />
              {isOpen && <span className="label">CGPA</span>}
            </Link>
          </li>
          <li>
            <Link to={`/student/dashboard/${id}/profile`}>
              <FontAwesomeIcon icon={faUser} className="icon" />
              {isOpen && <span className="label">Profile</span>}
            </Link>
          </li>
        </ul>
      </div>

      {/* Outlet to render the nested components */}
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentDashboard;
