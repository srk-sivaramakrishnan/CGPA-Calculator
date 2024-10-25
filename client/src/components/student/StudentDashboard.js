import React, { useState } from 'react';
import { UisApps } from '@iconscout/react-unicons-solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faChartBar, faCalculator, faUser, faChartLine, faCog, faTimes, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, Outlet, useParams } from 'react-router-dom';
import '../../styles/admin/AdminDashboard.css';

const StudentDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isBottomContainerOpen, setIsBottomContainerOpen] = useState(false);
  const { id } = useParams();

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  const toggleBottomContainer = () => {
    setIsBottomContainerOpen(prev => !prev);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Toggle Button */}
        <div className="dashboard-button" onClick={toggleSidebar}>
          <span className="arrow-icon">
            <FontAwesomeIcon icon={isOpen ? faArrowLeft : faArrowRight} className="icon" />
          </span>
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
        
        {/* Logout Link at the bottom of the sidebar */}
        <ul>
          <li>
            <Link to="/student/login">
              <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
              {isOpen && <span className="label">Logout</span>}
            </Link>
          </li>
        </ul>
      </div>

      {/* Outlet to render the nested components */}
      <div className="dashboard-content">
        <Outlet />
      </div>
{/* Bottom Container and Icon (Only for Mobile) */}
<div className={`bottom-container ${isBottomContainerOpen ? 'active' : ''}`}>
  {/* Close Icon to close the bottom container */}
  <div className="close-icon" onClick={() => setIsBottomContainerOpen(false)}>
    <FontAwesomeIcon icon={faTimes} />
  </div>
  <ul>
    <li className="bottom-link">
      <Link to={`/student/dashboard/${id}/gpa`}>
        <div className="icon">
          <FontAwesomeIcon icon={faChartBar} />
        </div>
        <span className="link-label">GPA</span>
      </Link>
    </li>
    <li className="bottom-link">
      <Link to={`/student/dashboard/${id}/cgpa`}>
        <div className="icon">
          <FontAwesomeIcon icon={faCalculator} />
        </div>
        <span className="link-label">CGPA</span>
      </Link>
    </li>
    <li className="bottom-link">
      <Link to={`/student/dashboard/${id}/profile`}>
        <div className="icon">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <span className="link-label">Profile</span>
      </Link>
    </li>
    <li className="bottom-link">
      <Link to={`/student/dashboard/${id}/analytics`}>
        <div className="icon">
          <FontAwesomeIcon icon={faChartLine} />
        </div>
        <span className="link-label">Analytics</span>
      </Link>
    </li>
    <li className="bottom-link">
      <Link to={`/student/dashboard/${id}/settings`}>
        <div className="icon">
          <FontAwesomeIcon icon={faCog} />
        </div>
        <span className="link-label">Settings</span>
      </Link>
    </li>
    {/* Logout Link in the bottom container */}
    <li className="bottom-link">
      <Link to="/student/login">
        <div className="icon">
          <FontAwesomeIcon icon={faSignOutAlt} />
        </div>
        <span className="link-label">Logout</span>
      </Link>
    </li>
  </ul>
</div>


      {/* Bottom Icon to Open Container (Only for Mobile) */}
      <div className="bottom-icon" onClick={toggleBottomContainer}>
        <UisApps className="icon" />
      </div>
    </div>
  );
};

export default StudentDashboard;
