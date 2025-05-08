/**
 * Sighting Component
 * This component displays a map centered on the user's location and shows nearby firefly sightings
 * from both the user's submissions and iNaturalist observations.
 */

import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import Map from "./Map";
import "../sighting.css";
import { useFireflyInaturalistData } from "../hooks/useInaturalistData";
import ObservationPopup from "./ObservationPopup";
import SightingForm from "./SightingForm";
import EditSightingForm from "./EditSightingForm";

function Sighting({ user }) {
  // State for managing user's location and related UI states
  const [userLocation, setUserLocation] = useState(null); // Stores the user's current coordinates
  const [locationError, setLocationError] = useState(null); // Stores any geolocation errors
  const [isLoadingLocation, setIsLoadingLocation] = useState(true); // Tracks geolocation loading state
  const [selectedObservation, setSelectedObservation] = useState(null); // Stores the currently selected observation for the popup
  const [selectedUserSighting, setSelectedUserSighting] = useState(null); // Stores the currently selected user sighting
  // const [showSightingForm, setShowSightingForm] = useState(false);
  const [showAddSightingForm, setShowAddSightingForm] = useState(false); // Controls visibility of the add sighting form
  const [showEditSightingForm, setShowEditSightingForm] = useState(false); // Controls visibility of the edit sighting form
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state for API calls
  const [error, setError] = useState(null); // Stores any error messages
  const [sightings, setSightings] = useState([]); // Stores the user's sightings

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

  // Fetch user sightings
  useEffect(() => {
    async function fetchUserSightings() {
      try {
        const response = await fetch("http://localhost:5555/sightings", {
          credentials: "include",
        });
        const data = await response.json();
        setSightings(data);
      } catch (error) {
        console.error("Error fetching user sightings:", error);
      }
    }
    fetchUserSightings();
  }, []);

  /**
   * Prepare markers from iNaturalist data
   * Parses the location string into latitude and longitude coordinates
   * Creates marker objects with position, title, and ID
   */
  const inaturalistMarkers =
    // Map over the observations and create markers
    data?.results?.map((observation) => {
      // Only process observations with a valid location
      if (!observation.location || !observation.location.includes(",")) {
        return null;
      }
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
        title: String(observation.species_guess) || "Unknown Firefly",
        id: observation.id,
        observation: observation, // Store the full observation data for the popup
      };
      // First, try to execute data?.results?.map(...) - if data or results are null/undefined, return an empty array (don't throw an error)
    }) || [];

  const userSightings =
    // Map over the user's sightings and create markers
    sightings?.map((sighting) => {
      // Only process sightings with a valid location
      // if (!sighting.place_guess || !sighting.place_guess.includes(",")) {
      //   return null;
      // }
      if (
        typeof sighting.latitude !== "number" ||
        typeof sighting.longitude !== "number"
      ) {
        return null;
      }
      return {
        position: { lat: sighting.latitude, lng: sighting.longitude },
        title: sighting.species?.name || "Unknown Firefly",
        id: sighting.id,
        sighting: sighting, // Store the full sighting data for the popup 
      };
      // Parse the location string into latitude and longitude coordinates
      // const [lat, lng] = sighting.place_guess
      //   .split(",")
      //   .map((coord) => parseFloat(coord.trim()));
      // return {
      //   position: { lat, lng },
      //   title: String(sighting.species) || "Unknown Firefly",
      //   id: sighting.id,
      //   sighting: sighting, // Store the full sighting data for the popup
      // };
    }) || [];

  const allMarkers = [...inaturalistMarkers, ...userSightings];

  // Show loading state while getting user's location
  if (isLoadingLocation) {
    return <div className="loading">Getting your location...</div>;
  }

  // Show error state if geolocation failed
  if (locationError) {
    return <div className="error">Error: {locationError}</div>;
  }

  /**
   * Function to handle clicking a marker
   * Sets the appropriate state based on whether it's an iNaturalist observation or user sighting
   */
  function handleMarkerClick(marker) {
    console.log("Clicked marker:", marker);
    // If it's an iNaturalist marker
    if (marker.observation) {
      console.log("Setting iNaturalist observation:", marker.observation);
      setSelectedObservation(marker.observation);
    }
    // If it's a user sighting marker
    else {
      console.log("Setting user sighting:", marker.sighting);
      setSelectedUserSighting(marker.sighting);
    }
  }

  /**
   * Function to handle closing the popup
   * Resets both selected observation and user sighting states
   */
  function handleClosePopup() {
    setSelectedObservation(null);
    setSelectedUserSighting(null);
  }

  /**
   * Function to handle adding a sighting
   * Shows the add sighting form and resets other states
   */
  function handleAddSighting() {
    setShowAddSightingForm(true);
    setShowEditSightingForm(false);
    setSelectedUserSighting(null);
    setSelectedObservation(null);
  }

  /**
   * Function to handle submitting a new sighting
   * Makes a POST request to create a new sighting
   * Updates the sightings state with the new sighting
   */
  async function handleSubmitNewSighting(formData) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5555/sightings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create sighting");
      }

      // fetchUserSightings();
      const newSighting = await response.json(); // Don't use formData blindly, use the response to get the new sighting
      setSightings([...sightings, newSighting]);
      setShowAddSightingForm(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Function to handle submitting an edited sighting
   * Makes a PATCH request to update the sighting
   * Updates the sightings state with the edited sighting
   */
  async function handleSubmitEditSighting(formData) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:5555/sightings/${formData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update sighting");
      }

      const updatedSighting = await response.json();
      setSightings(
        sightings.map((s) =>
          s.id === updatedSighting.id ? updatedSighting : s
        )
      );
      setShowEditSightingForm(false);
      setSelectedUserSighting(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Function to handle editing a sighting
   * Shows the edit form and populates it with the selected sighting's data
   */
  function handleEditSighting(id) {
    const sightingToEdit = sightings.find((s) => s.id === id);
    if (!sightingToEdit) {
      setError("Sighting not found");
      return;
    }
    // fetchUserSightings();
    setSelectedUserSighting(sightingToEdit);
    setShowAddSightingForm(false);
    setShowEditSightingForm(true);
    setSelectedObservation(null);
  }

  /**
   * Function to handle deleting a sighting
   * Makes a DELETE request to remove the sighting
   * Updates the sightings state by removing the deleted sighting
   */
  async function handleDeleteSighting(id) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5555/sightings/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete sighting");
      }

      // fetchUserSightings();
      // Clear selected sighting and refresh sightings
      setSelectedUserSighting(null);
      // You'll need to implement fetchSightings to refresh the list
      setSightings(sightings.filter((s) => s.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="sighting-container">
      <h1>Glow Sighting</h1>
      {/* Action buttons */}
      <div className="action-buttons">
        <button onClick={handleAddSighting}>Add Sighting</button>
        {selectedUserSighting &&
          user &&
          selectedUserSighting.user_id === user.id && (
            <>
              <button
                onClick={() => handleEditSighting(selectedUserSighting.id)}
              >
                Edit Sighting
              </button>
              <button
                onClick={() => handleDeleteSighting(selectedUserSighting.id)}
              >
                Delete Sighting
              </button>
            </>
          )}
      </div>

      {/* Map container with user's location and iNaturalist markers */}
      <div className="map-container">
        <Map
          center={mapCenter}
          markers={allMarkers}
          zoom={10}
          onMarkerClick={handleMarkerClick}
        />
      </div>
      {/* Add Sighting Form */}
      {showAddSightingForm && (
        <SightingForm
          onSubmit={handleSubmitNewSighting}
          onCancel={() => setShowAddSightingForm(false)}
        />
      )}
      {/* Edit Sighting Form */}
      {showEditSightingForm && (
        <EditSightingForm
          sighting={selectedUserSighting} // Pass the sighting to edit if one is selected
          onSubmit={handleSubmitEditSighting}
          onCancel={() => setShowEditSightingForm(false)}
        />
      )}

      {/* Observation popup */}
      {(selectedObservation || selectedUserSighting) && (
        <ObservationPopup
          observation={selectedObservation || selectedUserSighting}
          onClose={handleClosePopup}
          onDelete={handleDeleteSighting}
          onEdit={handleEditSighting}
        />
      )}
    </div>
  );
}

export default Sighting;
