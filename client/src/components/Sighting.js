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
import SightingForm from "./SightingForm";

function Sighting() {
  // State for managing user's location and related UI states
  const [userLocation, setUserLocation] = useState(null); // Stores the user's current coordinates
  const [locationError, setLocationError] = useState(null); // Stores any geolocation errors
  const [isLoadingLocation, setIsLoadingLocation] = useState(true); // Tracks geolocation loading state
  const [selectedObservation, setSelectedObservation] = useState(null); // Stores the currently selected observation for the popup
  const [showSightingForm, setShowSightingForm] = useState(false);
  const [formData, setFormData] = useState({
    species_id: "",
    location: "",
    timestamp: "",
    description: "",
    image: "",
  });
  // const [userSightings, setUserSightings] = useState([]);

  /**
   * useEffect hook to get the user's location when the component mounts
   * Uses the browser's geolocation API to request the user's current position
   */
  useEffect(() => {
    // Check if the browser supports geolocation
    if (navigator.geolocation) {
      // Get the user's current position
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          // Extract latitude and longitude from the position object
          const { latitude, longitude } = position.coords;
          // Update the userLocation state with the current coordinates
          setUserLocation({ lat: latitude, lng: longitude });
          // Set the loading state to false because we have the user's location
          setIsLoadingLocation(false);
        }
      );
    } else {
      // Set the error message and set loading state to false because we don't have the user's location
      setLocationError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
    }
  }, []);

  // Set the map center to the user's location or default to (0,0) if not available
  const mapCenter = userLocation || { lat: 0, lng: 0 };

  /**
   * Fetch iNaturalist data using the custom hook
   * Passes the user's location to get observations near them
   * Default radius is set to 10 kilometers
   */
  const { data } = useFireflyInaturalistData({
    lat: userLocation?.lat,
    lng: userLocation?.lng,
    radius: 10,
  });

  /**
   * Prepare markers from iNaturalist data
   * Parses the location string into latitude and longitude coordinates
   * Creates marker objects with position, title, and ID
   */
  const inaturalistMarkers =
    // Map over the observations and create markers
    data?.results?.map((observation) => {
      // Extract latitude and longitude from the location string
      const [lat, lng] = observation.location
        // Split the location string into an array of coordinates and parse each coordinate as a float
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      return {
        // Create a marker object with position, title, and ID
        position: {
          lat,
          lng,
        },
        title: observation.species_guess || "Unknown Firefly",
        id: observation.id,
        observation: observation, // Store the full observation data for the popup
      };
    // First, try to execute data?.results?.map(...) - if data or results are null/undefined, return an empty array (don't throw an error)
    }) || [];

  // Show loading state while getting user's location
  if (isLoadingLocation) {
    return <div className="loading">Getting your location...</div>;
  }

  // Show error state if geolocation failed
  if (locationError) {
    return <div className="error">Error: {locationError}</div>;
  }

  // Function to handle clicking a marker
  function handleMarkerClick(marker) {
    setSelectedObservation(marker.observation);
  }

  // Function to handle closing the popup
  function handleClosePopup() {
    setSelectedObservation(null);
  }

  // Function to handle adding a sighting
  function handleAddSighting() {
    setShowSightingForm(true);
  }

  // Function to handle submitting the sighting form
  function handleSubmit(formData) {
    setShowSightingForm(false);
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

      {/* Add Sighting button */}
      <button onClick={handleAddSighting}>Add Sighting</button>

      {/* Sighting form - only visible when showSightingForm is true */}
      {showSightingForm && (
        <SightingForm
          sighting={null} // Pass null for new sighting
          onSubmit={handleSubmit}
          onCancel={() => setShowSightingForm(false)}
        />
      )}

      {/* Observation popup */}
      <ObservationPopup
        observation={selectedObservation}
        onClose={handleClosePopup}
      />
    </div>
  );
}

export default Sighting;
