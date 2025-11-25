// src/components/auth/RouteHandler.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RouteHandler = () => {
  const { isAuthenticated, isAdmin, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!initialized) return;

    // If user is authenticated and is admin, and they're on the home page
    if (isAuthenticated && isAdmin && location.pathname === '/') {
      navigate('/admin');
    }
    
    // If user is admin and tries to access login page, redirect to admin
    if (isAuthenticated && isAdmin && location.pathname === '/login') {
      navigate('/admin');
    }

  }, [isAuthenticated, isAdmin, initialized, navigate, location.pathname]);

  return null;
};

export default RouteHandler;