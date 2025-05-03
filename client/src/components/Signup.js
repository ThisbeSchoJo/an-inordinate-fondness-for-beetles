import { useNavigate, NavLink, useOutletContext } from "react-router-dom";
import { useState } from "react";
import "../signup.css";

function Signup() {
  const { updateUser } = useOutletContext();
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup data being sent:", signUpData);
    fetch("http://localhost:5555/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(signUpData),
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
