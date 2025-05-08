/**
 * Signup Component
 * Handles user registration with profile picture upload
 * Manages form state and submission to the backend
 * Provides navigation to login for existing users
 */

import { useNavigate, NavLink, useOutletContext } from "react-router-dom";
import { useState } from "react";
import "../signup.css";

function Signup() {
  // Get updateUser function from context to update global user state after successful signup
  const { updateUser } = useOutletContext();
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State to manage form data including profile picture, username, and password
  const [signUpData, setSignUpData] = useState({
    profile_picture: null,
    username: "",
    password: "",
  });

  /**
   * Handles changes to form inputs
   * Special handling for file input (profile picture)
   * Updates state with new input values
   */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_picture") {
      setSignUpData((prev) => ({ ...prev, profile_picture: files[0] }));
    } else {
      setSignUpData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /**
   * Handles form submission
   * Creates FormData object for multipart/form-data submission
   * Makes POST request to signup endpoint
   * Handles success and error cases
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup data being sent:", signUpData);

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append("profile_picture", signUpData.profile_picture);
    formData.append("username", signUpData.username);
    formData.append("password", signUpData.password);

    // Make POST request to signup endpoint
    fetch("http://localhost:5555/signup", {
      method: "POST",
      body: formData,
      // no headers needed for form data
      credentials: "include",
    })
      .then((response) => {
        console.log("Signup response status:", response.status);
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((err) => {
            // Handle specific error cases
            if (response.status === 409) {
              throw new Error(
                "Username already exists. Please choose a different username."
              );
            } else {
              throw new Error(
                err.error || "Registration failed. Please try again."
              );
            }
          });
        }
      })
      .then((user) => {
        // Update global user state and redirect to home page
        updateUser(user);
        navigate("/");
      })
      .catch((error) => {
        console.error("Signup error:", error);
        alert(error.message);
      });
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Signup</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        {/* Profile picture upload field */}
        <div className="form-group">
          <label className="form-label">Profile Picture</label>
          <input
            type="file"
            name="profile_picture"
            onChange={handleChange}
            accept="image/*"
            className="form-input"
          />
        </div>

        {/* Username input field */}
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            value={signUpData.username}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Password input field */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={signUpData.password}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="submit-button">
          Signup
        </button>

        {/* Link to login page for existing users */}
        <NavLink to="/login" className="nav-link">
          Already a member? Log in!
        </NavLink>
      </form>
    </div>
  );
}

export default Signup;
