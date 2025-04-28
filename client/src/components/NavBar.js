import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/sightings">Sightings</NavLink>
      <NavLink to="/species">Species</NavLink>
      <NavLink to="/login">Login</NavLink>
    </nav>
  );
}

export default NavBar;
