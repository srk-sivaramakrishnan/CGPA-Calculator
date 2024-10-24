// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route index element={<AdminHome />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="credits" element={<AdminCgpa />} />
            <Route path="credits/addcredits" element={<AddCredits />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="students/addstudents" element={<AddStudents />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
          <Route path="/student/dashboard/:id" element={<StudentDashboard />}>
            <Route index element={<StudentGPA />} /> 
            <Route path="gpa" element={<StudentGPA />} />
            <Route path="gpa/addgpa" element={<AddGPA />} />
            <Route path="cgpa" element={<StudentCGPA />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
