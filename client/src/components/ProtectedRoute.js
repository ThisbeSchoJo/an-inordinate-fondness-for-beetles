// This component is used to protect routes that require authentication
// It checks if the user is authenticated and redirects to the login page if not

import { Navigate, useOutletContext } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user } = useOutletContext();

  // If user is null (not logged in), redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If we have a user, render the protected content
  return children;
}

export default ProtectedRoute;
