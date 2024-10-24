import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, Navigate } from 'react-router-dom';
import Home from './components/pages/Home';
import AdminLogin from './components/pages/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminHome from './components/admin/AdminHome';
import AdminCgpa from './components/admin/AdminCredits';
import AddCredits from './components/admin/AddCredits';
import AdminStudents from './components/admin/AdminStudents';
import AdminReports from './components/admin/AdminReports';
import AddStudents from './components/admin/AddStudents';
import StudentLogin from './components/pages/StudentLogin';
import StudentDashboard from './components/student/StudentDashboard'; 
import AddGPA from './components/student/AddGPA';
import StudentGPA from './components/student/StudentGPA'; 
import StudentCGPA from './components/student/StudentCGPA'; 
import StudentProfile from './components/student/StudentProfile'; 
import StudentSettings from './components/student/StudentSettings';
import StudentAnalytics from './components/student/StudentAnalytics';

const ProtectedDashboard = () => {
  const { id } = useParams(); // Use useParams to get the ID from the URL
  const loggedInStudentId = localStorage.getItem('studentId');

  // Redirect to login if user is not logged in or the IDs do not match
  if (!loggedInStudentId || loggedInStudentId !== id) {
    return <Navigate to="/student/login" />;
  }

  return <StudentDashboard />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route index element={<AdminHome />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="credits" element={<AdminCgpa />} />
            <Route path="credits/addcredits" element={<AddCredits />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="students/addstudents" element={<AddStudents />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard/:id" element={<ProtectedDashboard />}>
            <Route index element={<StudentGPA />} /> 
            <Route path="gpa" element={<StudentGPA />} />
            <Route path="gpa/addgpa" element={<AddGPA />} />
            <Route path="cgpa" element={<StudentCGPA />} />
            <Route path="profile" element={<StudentProfile />} />  {/* Fixed line */}
            <Route path='analytics' element={<StudentAnalytics />} />
            <Route path="settings" element={<StudentSettings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
