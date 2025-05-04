import { useNavigate, NavLink, useOutletContext } from "react-router-dom";
import { useState } from "react";
import "../signup.css";

function Signup() {
  const { updateUser } = useOutletContext();
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    profilePicture: null,
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const {name, value, files } = e.target;
    if (name === "profilePicture") {
      setSignUpData((prev) => ({...prev, profilePicture: files[0]}));
    } else {
      setSignUpData((prev) => ({...prev, [name]: value}));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup data being sent:", signUpData);
    const formData = new FormData();
    formData.append("profilePicture", signUpData.profilePicture);
    formData.append("username", signUpData.username);
    formData.append("password", signUpData.password);
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
        <div className="form-group">
          <label className="form-label">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            onChange={handleChange}
            accept="image/*"
            className="form-input"
          />
        </div>
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
        <button type="submit" className="submit-button">
          Signup
        </button>
        <NavLink to="/login" className="nav-link">
          Already a member? Log in!
        </NavLink>
      </form>
    </div>
  );
}

export default Signup;
