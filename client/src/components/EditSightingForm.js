/**
 * EditSightingForm Component
 * A form component for editing existing firefly sightings
 * Includes fields for species, location, date, description, and photos
 * Features an interactive map for selecting location
 */

import { useState, useEffect } from "react";
import "../sightingform.css";
import "../editsightingform.css";
import Map from "./Map";

function EditSightingForm({ sighting, onSubmit, onCancel }) {
  // State for managing the map location
  const [mapLocation, setMapLocation] = useState(null);

  // Form state to manage input values
  const [formData, setFormData] = useState({
    species_id: "",
    place_guess: "latitude, longitude",
    observed_on: "",
    description: "",
    photos: "",
    latitude: "",
    longitude: "",
  });

  // State for storing the list of available species
  const [speciesList, setSpeciesList] = useState([]);

  /**
   * Fetch species list when component mounts
   * Populates the species dropdown with available options
   */
  useEffect(() => {
    fetch("/species")
      .then((response) => response.json())
      .then((data) => setSpeciesList(data));
  }, []);

  /**
   * Initialize form data when sighting changes
   * Populates form fields with existing sighting data
   * Handles both edit mode and create mode
   */
  useEffect(() => {
    if (sighting) {
      // If editing, populate form with sighting data
      setFormData({
        species_id: sighting.species_id || "",
        place_guess: sighting.place_guess || "",
        observed_on: formatTimestamp(sighting.observed_on),
        description: sighting.description || "",
        photos: sighting.photos || "",
        latitude: sighting.latitude || "",
        longitude: sighting.longitude || "",
      });

      // Set map location if valid coordinates exist
      if (
        typeof sighting.location === "string" &&
        sighting.location.includes(",")
      ) {
        const [latitude, longitude] = sighting.location.split(",").map(Number);
        if (!isNaN(latitude) && !isNaN(longitude)) {
          setMapLocation({ lat: latitude, lng: longitude });
        } else {
          setMapLocation(null);
        }
      } else {
        setMapLocation(null);
      }
    } else {
      // If creating, reset form to empty values
      setFormData({
        species_id: "",
        place_guess: "",
        observed_on: "",
        description: "",
        photos: "",
        latitude: "",
        longitude: "",
      });
      setMapLocation(null);
    }
  }, [sighting]);

  /**
   * Format timestamp for datetime-local input
   * Converts database timestamp to YYYY-MM-DDTHH:MM format
   */
  function formatTimestamp(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  }

  /**
   * Handle input changes
   * Updates form state when user types in any field
   */
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  /**
   * Handle form cancellation
   * Resets form state and calls onCancel prop
   */
  const handleCancel = () => {
    setFormData({
      species_id: "",
      place_guess: "",
      observed_on: "",
      description: "",
      photos: "",
      latitude: "",
      longitude: "",
    });
    setMapLocation(null);
    onCancel();
  };

  /**
   * Handle map click
   * Updates location fields when user clicks on the map
   */
  const handleMapClick = (coords) => {
    const locationString = `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;
    setMapLocation(coords);
    setFormData({
      ...formData,
      place_guess: locationString,
      latitude: coords.lat,
      longitude: coords.lng,
    });
  };

  /**
   * Handle form submission
   * Processes form data and calls onSubmit prop
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse the location string into latitude and longitude
    const [latitude, longitude] = formData.place_guess
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    const submissionData = {
      id: sighting.id,
      ...formData,
    };

    onSubmit(submissionData);
  };

  return (
    <>
      {/* Semi-transparent overlay */}
      <div className="edit-sighting-form-overlay" onClick={handleCancel} />

      {/* Form container */}
      <div className="edit-sighting-form-container">
        <form className="edit-sighting-form" onSubmit={handleSubmit}>
          <h2>Edit Sighting</h2>

          {/* Species dropdown */}
          <div>
            <label htmlFor="species_id">Species:</label>
            <select
              id="species_id"
              name="species_id"
              value={formData.species_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a species</option>
              {speciesList.map((species) => (
                <option key={species.id} value={species.id}>
                  {species.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location input */}
          <div>
            <label htmlFor="place_guess">Location:</label>
            <input
              type="text"
              id="place_guess"
              name="place_guess"
              value={formData.place_guess}
              onChange={handleChange}
              required
            />
          </div>

          {/* Timestamp input */}
          <div>
            <label htmlFor="observed_on">Timestamp:</label>
            <input
              type="datetime-local"
              id="observed_on"
              name="observed_on"
              value={formData.observed_on}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description input */}
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Image URL input */}
          <div>
            <label htmlFor="photos">Image URL:</label>
            <input
              type="url"
              id="photos"
              name="photos"
              value={formData.photos}
              onChange={handleChange}
            />
          </div>

          {/* Interactive map for location selection */}
          <p>Click on the map to set location:</p>
          <div className="map-container">
            <Map
              onMapClick={handleMapClick}
              center={mapLocation || { lat: 39.5, lng: -98.35 }}
              zoom={mapLocation ? 12 : 5}
              markers={mapLocation ? [{ position: mapLocation }] : []}
            />
          </div>

          {/* Display selected location */}
          {mapLocation && (
            <p className="selected-location">
              Selected location: {formData.place_guess}
            </p>
          )}

          {/* Form action buttons */}
          <div className="edit-sighting-form-buttons">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditSightingForm;
