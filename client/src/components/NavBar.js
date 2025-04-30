// NavBar component provides navigation links for the application
// It conditionally renders different links based on user authentication status
import { NavLink } from "react-router-dom";

function NavBar({ user }) {
  return (
    // Main navigation container with navbar class for styling
    <nav className="navbar">
      {/* Always visible navigation links */}
      <NavLink to="/">Home</NavLink>
      <NavLink to="/sightings">Sightings</NavLink>
      <NavLink to="/species">Species</NavLink>

      {/* Conditional rendering based on user authentication */}
      {user ? (
        // If user is authenticated, show logout button
        <>
          <NavLink to="/logout">Logout</NavLink>
        </>
      ) : (
        // If user is not authenticated, show login button
        <NavLink to="/login">Login</NavLink>
      )}
    </nav>
  );
}

export default NavBar;
