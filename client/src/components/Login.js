import { NavLink, useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import "../login.css";

function Login() {
  // Get the updateUser function from App.js through React Router's context
  const { updateUser } = useOutletContext();
  const navigate = useNavigate();

  // State for the login form
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // Handle input changes in the login form
  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Send login request to backend
    fetch("http://localhost:5555/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Invalid username or password");
        }
      })
      .then((user) => {
        // On successful login:
        // 1. Update the authentication state with user data
        updateUser(user);
        // 2. Redirect to home page
        navigate("/");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Please Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">
          Log in!
        </button>
        <NavLink to="/signup" className="nav-link">
          Not a member? Sign up!
        </NavLink>
      </form>
    </div>
  );
}

export default Login;
