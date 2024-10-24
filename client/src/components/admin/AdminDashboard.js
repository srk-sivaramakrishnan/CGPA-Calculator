import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faChartPie, faFileAlt, faUsers } from '@fortawesome/free-solid-svg-icons'; // Import faUsers for the Students icon
import '@fortawesome/fontawesome-svg-core/styles.css'; 
import '../../styles/admin/AdminDashboard.css'; 
import { Link, Outlet } from 'react-router-dom'; 

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle sidebar open/close
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} size="2x" />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <FontAwesomeIcon icon={faHome} className="icon" />
            <Link to="/admin/dashboard/home">Home</Link>
          </li>
          <li>
            <FontAwesomeIcon icon={faChartPie} className="icon" />
            <Link to="/admin/dashboard/credits">Subjects & Credits</Link>
          </li>
          <li>
            <FontAwesomeIcon icon={faUsers} className="icon" /> {/* Icon for Students */}
            <Link to="/admin/dashboard/students">Students</Link> {/* New link for Students */}
          </li>
          <li>
            <FontAwesomeIcon icon={faFileAlt} className="icon" />
            <Link to="/admin/dashboard/reports">Reports</Link>
          </li>
        </ul>
      </div>

      {/* Outlet to render the nested components */}
      <div className="dashboard-content">
        <Outlet /> {/* This is where AdminHome, AdminCgpa, etc. will be rendered */}
      </div>
    </div>
  );
};

export default AdminDashboard;
