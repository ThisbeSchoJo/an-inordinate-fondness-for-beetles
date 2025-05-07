import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SightingList from "./components/SightingList";
import SightingForm from "./components/SightingForm";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:5555/check_session", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            // User not found, clear session
            setUser(null);
          } else {
            throw new Error(`Session check failed: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }
          setUser(data);
        }
      } catch (err) {
        console.error("Session check failed:", err);
        setError(err.message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setError(null);
  };

  const handleLogout = () => {
    setUser(null);
    setError(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <NavBar user={user} onLogout={handleLogout} />
        {error && <div className="error-message">{error}</div>}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/sightings" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              user ? (
                <Navigate to="/sightings" />
              ) : (
                <Signup onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/sightings"
            element={user ? <SightingList /> : <Navigate to="/login" />}
          />
          <Route
            path="/sightings/new"
            element={user ? <SightingForm /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
