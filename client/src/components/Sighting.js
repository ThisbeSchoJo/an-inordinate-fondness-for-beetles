import React, { useState } from "react";
import Map from "./Map";
import "../sighting.css";

/**
 * Sighting Component
 * This component displays a beetle sighting with an interactive map
 * and sighting details. It manages the state for the map center
 * and markers.
 */
function Sighting() {
  // State for the map's center coordinates
  // Currently set to New York City coordinates as an example
  const [mapCenter, setMapCenter] = useState({
    lat: 40.7128,
    lng: -74.006,
  });

  // State for the sighting data
  // This would typically be populated from your backend API
  const [sightingData, setSightingData] = useState({
    species: "",
    location: "",
    timestamp: "",
    description: "",
    image: "",
  });

  // State for the markers to display on the map
  // Each marker has a position and title
  const [markers, setMarkers] = useState([]);

  return (
    // Main container for the sighting page
    <div className="sighting-container">
      <h1>Glow Sighting</h1>

      {/* Container for the map component */}
      <div className="map-container">
        {/* Pass the center coordinates and markers to the Map component */}
        <Map center={mapCenter} markers={markers} />
      </div>

      {/* Container for the sighting details */}
      <div className="sighting-details-container">
        <h2>Sighting Details</h2>
        {/* Display each piece of sighting information */}
        <div className="detail-item">
          <strong>Species:</strong> {sightingData.species}
        </div>
        <div className="detail-item">
          <strong>Location:</strong> {sightingData.location}
        </div>
        <div className="detail-item">
          <strong>Date/Time:</strong> {sightingData.timestamp}
        </div>
        <div className="detail-item">
          <strong>Description:</strong>
          <p>{sightingData.description}</p>
        </div>
      </div>
    </div>
  );
}

export default Sighting;
