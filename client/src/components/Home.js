import React from "react";
import "../home.css";

function Home() {
    return (
        <>
            <h1>Welcome to Firefly Finder</h1>
            <p>Find and share firefly sightings near you.</p>
            <div className="firefly-logo-container">
                <img src="/firefly-logo.gif" alt="Firefly Logo" />
            </div>
        </>
    )
}

export default Home;
