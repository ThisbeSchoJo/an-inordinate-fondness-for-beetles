/**
 * SightingList Component
 * This component manages the list of user-submitted firefly sightings.
 * It provides functionality to view, create, edit, and delete sightings.
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../sighting-list.css";
import SightingItem from "./SightingItem";
import SightingActions from "./SightingActions";
import SightingForm from "./SightingForm";

function SightingList( {user} ) {
  // State for managing sightings data and UI states
  const [sightings, setSightings] = useState([]); // Stores the list of sightings
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(null); // Stores any error messages
  const [editingSighting, setEditingSighting] = useState(null); // Stores the sighting being edited
  const [formData, setFormData] = useState({
    // Form data for creating/editing sightings
    species: "",
    place_guess: "",
    observed_on: "",
    description: "",
    photos: "",
  });
  const [selectedSighting, setSelectedSighting] = useState(null); // Currently selected sighting for editing/deleting
  const [isEditing, setIsEditing] = useState(false); // Tracks whether the user is in edit mode
  

  /**
   * useEffect hook to fetch sightings when the component mounts
   * Makes a GET request to the backend API to retrieve all sightings
   */
  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const response = await fetch("/sightings");
        if (!response.ok) {
          throw new Error("Failed to fetch sightings");
        }
        const data = await response.json();
        setSightings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSightings();
  }, []);

  /**
   * Handles form input changes
   * Updates the formData state with the new input values
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles form submission for creating a new sighting
   * Makes a POST request to the backend API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/sightings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create sighting");
      }

      const newSighting = await response.json();
      setSightings((prev) => [...prev, newSighting]);
      setFormData({
        species: "",
        location: "",
        timestamp: "",
        description: "",
        image: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handles the start of editing a sighting
   * Sets the editingSighting state and populates the form with the sighting's data
   */
  const handleEdit = (sighting) => {
    setEditingSighting(sighting);
    setFormData({
      species: sighting.species,
      location: sighting.location,
      timestamp: sighting.timestamp,
      description: sighting.description,
      image: sighting.image,
    });
  };

  /**
   * Handles the update of an existing sighting
   * Makes a PUT request to the backend API
   */
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/sightings/${editingSighting.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update sighting");
      }

      const updatedSighting = await response.json();
      setSightings((prev) =>
        prev.map((s) => (s.id === updatedSighting.id ? updatedSighting : s))
      );
      setEditingSighting(null);
      setFormData({
        species: "",
        location: "",
        timestamp: "",
        description: "",
        image: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handles the deletion of a sighting
   * Makes a DELETE request to the backend API
   */
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/sightings/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete sighting");
      }

      setSightings((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return <div className="loading">Loading sightings...</div>;
  }

  // Show error state if there was an error
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="sighting-list-container">
      <h1>My Firefly Sightings</h1>

      {/* Form for creating/editing sightings */}
      <form onSubmit={editingSighting ? handleUpdate : handleSubmit}>
        <div className="form-group">
          <label htmlFor="species">Species:</label>
          <input
            type="text"
            id="species"
            name="species"
            value={formData.species}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="timestamp">Date/Time:</label>
          <input
            type="datetime-local"
            id="timestamp"
            name="timestamp"
            value={formData.timestamp}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit">
          {editingSighting ? "Update Sighting" : "Add Sighting"}
        </button>
        {editingSighting && (
          <button type="button" onClick={() => setEditingSighting(null)}>
            Cancel
          </button>
        )}
      </form>

      {/* List of sightings */}
      <div className="sightings-list">
        {sightings.map((sighting) => (
          <div key={sighting.id} className="sighting-card">
            <h2>{sighting.species}</h2>
            <p>
              <strong>Location:</strong> {sighting.location}
            </p>
            <p>
              <strong>Date/Time:</strong> {sighting.timestamp}
            </p>
            <p>
              <strong>Description:</strong> {sighting.description}
            </p>
            {sighting.image && (
              <img src={sighting.image} alt={sighting.species} />
            )}
            {sighting.user_id === user.id && (
              <div className="sighting-actions">
                <button onClick={() => handleEdit(sighting)}>Edit</button>
                <button onClick={() => handleDelete(sighting.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SightingList;
