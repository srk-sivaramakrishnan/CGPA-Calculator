// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, userId, requiredId }) => {
  return userId === requiredId ? element : <Navigate to="/student/login" />;
};

export default ProtectedRoute;
