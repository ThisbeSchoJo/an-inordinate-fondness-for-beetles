import React, { useState } from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null)

  const updateUser = (userData) => {
    setUser(userData)
  }
  return (
    <>
      <NavBar />
      <Outlet context={{
        user,
        updateUser
      }} />
    </>
  );
}

export default App;
