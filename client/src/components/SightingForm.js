/**
 * SightingForm Component
 * A form component for creating new firefly sightings
 * Includes fields for species, location, date, description, and photos
 * Features an interactive map for selecting location
 */

import { useState, useEffect } from "react";
import "../sightingform.css";
import Map from "./Map";

function SightingForm({ onSubmit, onCancel, userLocation }) {
  // State for managing the map location
  const [mapLocation, setMapLocation] = useState(userLocation);

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
    // const [latitude, longitude] = formData.place_guess
    //   .split(",")
    //   .map((coord) => parseFloat(coord.trim()));

    // const submissionData = {
    //   ...formData,
    // };
    const [lat, lng] = formData.place_guess
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    const submissionData = {
      ...formData,
      latitude: lat,
      longitude: lng,
    };


    onSubmit(submissionData);
  };

  return (
    <div className="sighting-form">
      <form onSubmit={handleSubmit}>
        {/* Species dropdown */}
        <div className="form-group">
          <label className="form-label" htmlFor="species_id">
            Species:
          </label>
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
        <div className="form-group">
          <label className="form-label" htmlFor="place_guess">
            Location:
          </label>
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
        <div className="form-group">
          <label className="form-label" htmlFor="observed_on">
            Timestamp:
          </label>
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
        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Image URL input */}
        <div className="form-group">
          <label className="form-label" htmlFor="photos">
            Image URL:
          </label>
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
        <div className="form-buttons">
          <button type="submit">Add Sighting</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SightingForm;
