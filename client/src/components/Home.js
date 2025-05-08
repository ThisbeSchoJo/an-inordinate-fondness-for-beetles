/**
 * Home Component
 * Displays the landing page with an animated firefly logo
 * The firefly moves in a figure-8 pattern using requestAnimationFrame
 */

import React, { useEffect, useRef } from "react";
import "../home.css";

function Home() {
  // Ref for the firefly image element
  const fireflyRef = useRef(null);
  // Ref to store the current angle (unused but kept for potential future use)
  const angleRef = useRef(0);

  /**
   * useEffect hook to set up the firefly animation
   * Creates a continuous figure-8 motion using sine and cosine
   */
  useEffect(() => {
    // Get reference to the firefly image element
    const firefly = fireflyRef.current;

    // Exit if firefly element doesn't exist
    if (!firefly) return;

    // Set initial styles for the firefly
    firefly.style.position = "absolute";
    firefly.style.transition = "none";

    // Animation parameters
    let angle = 0; // Current angle in radians
    const speed = 0.01; // Speed of rotation
    const radius = 100; // Size of the figure-8 pattern
    let baseX = window.innerWidth / 2; // Center X position
    let baseY = window.innerHeight / 2; // Center Y position

    /**
     * Animation function that updates the firefly's position
     * Uses sine and cosine to create a figure-8 pattern
     * Different multipliers for X and Y create the figure-8 shape
     */
    function animate() {
      // Increment the angle
      angle += speed;
      // Calculate X offset using cosine
      const offsetX = Math.cos(angle) * radius;
      // Calculate Y offset using sine with a multiplier for figure-8 shape
      const offsetY = Math.sin(angle * 1.5) * radius;

      // Update firefly position
      firefly.style.left = `${baseX + offsetX}px`;
      firefly.style.top = `${baseY + offsetY}px`;

      // Request next animation frame
      requestAnimationFrame(animate);
    }

    // Start the animation
    animate();

    // Cleanup: cancel animation frame when component unmounts
    return () => cancelAnimationFrame(animate);
  }, []);

  return (
    <>
      {/* Main title */}
      <h1 className="home-title">Firefly Finder</h1>
      {/* Animated firefly logo */}
      <img
        id="firefly"
        ref={fireflyRef}
        src="/firefly-logo.gif"
        alt="Firefly Logo"
        style={{
          width: "50px",
          height: "50px",
          pointerEvents: "none", // Prevents image from capturing mouse events
        }}
      />
    </>
  );
}

export default Home;
