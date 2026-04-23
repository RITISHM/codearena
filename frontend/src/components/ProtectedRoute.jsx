import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Redirect to landing page but save the attempted url
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}
