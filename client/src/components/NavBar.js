// NavBar component provides navigation links for the application
// It conditionally renders different links based on user authentication status
import { NavLink, useNavigate } from "react-router-dom";
import "../navbar.css";
import { Home, MapPinned, LogOut, LogIn, User } from "lucide-react";

function NavBar({ user, updateUser }) {

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      // Make DELETE request to logout endpoint
      const response = await fetch("http://localhost:5555/logout", {
        method: "DELETE",
        credentials: "include",
      });
      // If the API call is successful, clear the user state
      if (response.ok) {
        updateUser(null);
      }
    } catch (error) {
      // Log any errors that occur during the logout process
      console.error("Error logging out:", error);
    }
    // Always navigate to the home page, regardless of API call success
    navigate("/");
  }

  return (
    // Main navigation container with navbar class for styling
    <nav className="navbar">
      {/* Always visible navigation links */}
      <NavLink to="/">
        <Home size={20} />
      </NavLink>
      <NavLink to="/profile">
        <User size={20} />
      </NavLink>
      <NavLink to="/sightings">
        <MapPinned size={20} />
      </NavLink>
      {/* Conditional rendering based on user authentication */}
      {user ? (
        // If user is authenticated, show logout button
        <>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} className="nav-icon" />
          </button>
        </>
      ) : (
        // If user is not authenticated, show login button
        <NavLink to="/login">
          <LogIn size={20} />
        </NavLink>
      )}
    </nav>
  );
}

export default NavBar;
