// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// Children is the component we want to protect (e.g., MoodLogger)
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // User is not logged in, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the protected component
  return children;
};

export default ProtectedRoute;