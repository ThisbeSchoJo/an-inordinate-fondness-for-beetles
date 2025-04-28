import { NavLink, useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";

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
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    <>
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={loginData.username}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
        />
        <button type="submit">Log in!</button>
        <NavLink to="/signup">Not a member? Sign up!</NavLink>
      </form>
    </>
  );
}

export default Login;
