// This component is used to protect routes that require authentication
// It checks if the user is authenticated and redirects to the login page if not

import { Navigate, useOutletContext } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user } = useOutletContext();

  // If user is null but we're still checking the session, show loading
  if (user === null) {
    return <div>Loading...</div>;
  }

  // If user is undefined (session check complete and no user), redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <div>{children}</div>;
}

export default ProtectedRoute;
