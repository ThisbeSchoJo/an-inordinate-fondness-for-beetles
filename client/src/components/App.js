import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

function App() {
  // Authentication state
  // user will be null when no user is logged in
  // user will contain user data (id, username, etc.) when logged in
  const [user, setUser] = useState(null);

  // Function to update the authentication state
  // Called after successful login/signup to store user data
  // Called after logout to clear user data (set to null)
  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <>
      <NavBar user={user} />
      <Outlet
        context={{
          user,
          updateUser,
        }}
      />
    </>
  );
}

export default App;
