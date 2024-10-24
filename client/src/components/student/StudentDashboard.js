import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faCalculator, faUser, faCog, faChartLine, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Added faChartLine for Analytics
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
          <li>
            {/* New Analytics Link */}
            <Link to={`/student/dashboard/${id}/analytics`}>
              <FontAwesomeIcon icon={faChartLine} className="icon" />
              {isOpen && <span className="label">Analytics</span>}
            </Link>
          </li>
          <li>
            <Link to={`/student/dashboard/${id}/settings`}>
              <FontAwesomeIcon icon={faCog} className="icon" />
              {isOpen && <span className="label">Settings</span>}
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
