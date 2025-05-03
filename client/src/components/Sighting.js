import React, { useState, useEffect } from "react";
import Map from "./Map";
import "../sighting.css";
import { useFireflyInaturalistData } from "../hooks/useInaturalistData";

/**
 * Sighting Component
 * This component displays a firefly sighting with an interactive map
 * and sighting details. It manages the state for the map center
 * and markers.
 */
function Sighting() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Get user's location when component mounts
  useEffect(() => {
    console.log("Requesting geolocation...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Got location:", { latitude, longitude });
          setUserLocation({ lat: latitude, lng: longitude });
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(error.message);
          setIsLoadingLocation(false);
        }
      );
    } else {
      console.log("Geolocation not supported");
      setLocationError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
    }
  }, []);

  // State for the sighting data
  const [sightingData, setSightingData] = useState({
    species: "",
    location: "",
    timestamp: "",
    description: "",
    image: "",
  });

  // Use the user's location for the map center
  const mapCenter = userLocation || { lat: 0, lng: 0 };
  console.log("Map center:", mapCenter);

  const { data, loading, error } = useFireflyInaturalistData({
    lat: userLocation?.lat,
    lng: userLocation?.lng,
    radius: 10,
  });
  console.log("iNaturalist data:", data);
  console.log("Loading:", loading);
  console.log("Error:", error);

  // Prepare markers from iNaturalist data
  const inaturalistMarkers =
    data?.results?.map((observation) => {
      const [lat, lng] = observation.location
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      return {
        position: {
          lat,
          lng,
        },
        title: observation.species_guess || "Unknown Firefly",
        id: observation.id,
      };
    }) || [];
  console.log("iNaturalist markers:", inaturalistMarkers);

  if (isLoadingLocation) {
    return <div className="loading">Getting your location...</div>;
  }

  if (locationError) {
    return <div className="error">Error: {locationError}</div>;
  }

  return (
    // Main container for the sighting page
    <div className="sighting-container">
      <h1>Glow Sighting</h1>

      {/* Container for the map component */}
      <div className="map-container">
        {/* Pass the center coordinates and markers to the Map component */}
        <Map center={mapCenter} markers={inaturalistMarkers} zoom={10} />
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
