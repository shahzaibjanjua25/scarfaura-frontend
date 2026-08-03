import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      toast.error('You must be logged in to access this page', {
        toastId: 'auth-required'
      });
    } else if (requiredRole && user.role !== requiredRole) {
      toast.error(`You need ${requiredRole} privileges to access this page`, {
        toastId: 'role-required'
      });
    }
  }, [user, requiredRole]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;