/**
 * Sighting Component
 * This component displays a map centered on the user's location and shows nearby firefly sightings
 * from both the user's submissions and iNaturalist observations.
 */

import React, { useState, useEffect } from "react";
import Map from "./Map";
import "../sighting.css";
import { useFireflyInaturalistData } from "../hooks/useInaturalistData";
import ObservationPopup from "./ObservationPopup";

function Sighting() {
  // State for managing user's location and related UI states
  const [userLocation, setUserLocation] = useState(null); // Stores the user's current coordinates
  const [locationError, setLocationError] = useState(null); // Stores any geolocation errors
  const [isLoadingLocation, setIsLoadingLocation] = useState(true); // Tracks geolocation loading state
  const [selectedObservation, setSelectedObservation] = useState(null); // Stores the currently selected observation for the popup

  // State for storing sighting details (currently not used but kept for future expansion)
  const [sightingData, setSightingData] = useState({
    species: "",
    location: "",
    timestamp: "",
    description: "",
    image: "",
  });

  /**
   * useEffect hook to get the user's location when the component mounts
   * Uses the browser's geolocation API to request the user's current position
   */
  useEffect(() => {
    console.log("Requesting geolocation...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Got location:", { latitude, longitude });
          setUserLocation({ lat: latitude, lng: longitude });
          setIsLoadingLocation(false);
        },
        // Error callback
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

  // Set the map center to the user's location or default to (0,0) if not available
  const mapCenter = userLocation || { lat: 0, lng: 0 };
  console.log("Map center:", mapCenter);

  /**
   * Fetch iNaturalist data using the custom hook
   * Passes the user's location to get observations near them
   * Default radius is set to 10 kilometers
   */
  const { data, loading, error } = useFireflyInaturalistData({
    lat: userLocation?.lat,
    lng: userLocation?.lng,
    radius: 10,
  });
  console.log("iNaturalist data:", data);
  console.log("Loading:", loading);
  console.log("Error:", error);

  /**
   * Prepare markers from iNaturalist data
   * Parses the location string into latitude and longitude coordinates
   * Creates marker objects with position, title, and ID
   */
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
        observation: observation, // Store the full observation data for the popup
      };
    }) || [];
  console.log("iNaturalist markers:", inaturalistMarkers);

  /**
   * Handle marker click
   * Sets the selected observation for the popup
   */
  const handleMarkerClick = (marker) => {
    setSelectedObservation(marker.observation);
  };

  /**
   * Handle popup close
   * Clears the selected observation
   */
  const handleClosePopup = () => {
    setSelectedObservation(null);
  };

  // Show loading state while getting user's location
  if (isLoadingLocation) {
    return <div className="loading">Getting your location...</div>;
  }

  // Show error state if geolocation failed
  if (locationError) {
    return <div className="error">Error: {locationError}</div>;
  }

  return (
    <div className="sighting-container">
      <h1>Glow Sighting</h1>

      {/* Map container with user's location and iNaturalist markers */}
      <div className="map-container">
        <Map
          center={mapCenter}
          markers={inaturalistMarkers}
          zoom={10}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* Observation popup */}
      <ObservationPopup
        observation={selectedObservation}
        onClose={handleClosePopup}
      />

      {/* Sighting details section (currently static, can be expanded later) */}
      <div className="sighting-details-container">
        <h2>Sighting Details</h2>
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
