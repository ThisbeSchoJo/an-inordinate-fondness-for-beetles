// This component handles user logout
// It makes an API call to clear the server session and updates the client-side state

import { useOutletContext, useNavigate } from "react-router-dom";

function Logout() {
  // Get the updateUser function from App's context to clear the user state
  const { updateUser } = useOutletContext();
  // Get the navigate function for programmatic navigation
  const navigate = useNavigate();

  // Async function to handle the logout process
  async function handleLogout() {
    try {
      // Make DELETE request to logout endpoint
      const response = await fetch("http://localhost:5000/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // If the API call is successful, clear the user state
      if (response.ok) {
        updateUser(null);
      }
    } catch (error) {
      // Log any errors that occur during the logout process
      console.error("Error logging out:", error);
    }
    // Always navigate to the login page, regardless of API call success
    navigate("/login");
  }

  return (
    <div>
      {/* Button that triggers the logout process when clicked */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
