// This component is used to protect routes that require authentication
// It checks if the user is authenticated and redirects to the login page if not

import { Navigate, useOutletContext } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user, isLoading } = useOutletContext();

  // Show loading state while checking session
  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // Only redirect if we're done loading and there's no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If we have a user, render the protected content
  return children;
}

export default ProtectedRoute;
