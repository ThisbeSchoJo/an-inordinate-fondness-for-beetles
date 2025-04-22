import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <NavBar />
      <Outlet context={{}} />
    </>
  );
}

export default App;
