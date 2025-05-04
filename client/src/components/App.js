import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import "../App.css";

function App() {
  // Authentication state
  // user will be null when no user is logged in
  // user will contain user data (id, username, etc.) when logged in
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in when app loads
    fetch("http://localhost:5555/check_session", {
      credentials: "include", // Important for cookies
    })
      .then((r) => {
        if (r.ok) {
          r.json().then((user) => setUser(user));
        }
      })
      .catch((error) => {
        console.error("Session check failed:", error);
      });
  }, []);

  // Function to update the authentication state
  // Called after successful login/signup to store user data
  // Called after logout to clear user data (set to null)
  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <div className="App">
      <NavBar user={user} updateUser={updateUser} />
      <main className="main-container">
        <Outlet
          context={{
            user,
            updateUser,
          }}
        />
      </main>
    </div>
  );
}

export default App;
