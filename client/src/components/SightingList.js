/**
 * SightingList Component
 * This component manages the list of user-submitted firefly sightings.
 * It provides functionality to view, create, edit, and delete sightings.
 */

import React, { useState, useEffect } from "react";
import "../sighting-list.css";
import ObservationPopup from "./ObservationPopup";
import AddSightingForm from "./AddSightingForm";
import EditSightingForm from "./EditSightingForm";

function SightingList({ user }) {
  // State for managing sightings data and UI states
  const [sightings, setSightings] = useState([]); // Stores the list of sightings
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(null); // Stores any error messages
  const [selectedSighting, setSelectedSighting] = useState(null); // Currently selected sighting for viewing/editing/deleting
  const [showAddSightingForm, setShowAddSightingForm] = useState(false); // Controls visibility of the add sighting form
  const [showEditSightingForm, setShowEditSightingForm] = useState(false); // Controls visibility of the edit sighting form

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
   * Handles the start of editing a sighting
   * Shows the edit form and sets the selected sighting
   */
  const handleEdit = (sighting) => {
    setSelectedSighting(sighting);
    setShowEditSightingForm(true);
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
      setSelectedSighting(null);
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handles submitting a new sighting
   * Makes a POST request to create a new sighting
   */
  const handleSubmitNewSighting = async (formData) => {
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
      setShowAddSightingForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handles submitting an edited sighting
   * Makes a PATCH request to update the sighting
   */
  const handleSubmitEditSighting = async (formData) => {
    try {
      const response = await fetch(`/sightings/${formData.id}`, {
        method: "PATCH",
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
      setShowEditSightingForm(false);
      setSelectedSighting(null);
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

      {/* Add Sighting button */}
      <button
        className="add-sighting-button"
        onClick={() => setShowAddSightingForm(true)}
      >
        Add New Sighting
      </button>

      {/* List of sightings */}
      <div className="sightings-list">
        {sightings.map((sighting) => (
          <div
            key={sighting.id}
            className="sighting-card"
            onClick={() => setSelectedSighting(sighting)}
          >
            <h2>{sighting.species?.name || "Unknown Species"}</h2>
            <p>
              <strong>Location:</strong> {sighting.place_guess}
            </p>
            <p>
              <strong>Date/Time:</strong> {sighting.observed_on}
            </p>
            {sighting.photos && (
              <img
                src={sighting.photos}
                alt={sighting.species?.name || "Firefly sighting"}
              />
            )}
          </div>
        ))}
      </div>

      {/* Add Sighting Form */}
      {showAddSightingForm && (
        <AddSightingForm
          onSubmit={handleSubmitNewSighting}
          onCancel={() => setShowAddSightingForm(false)}
        />
      )}

      {/* Edit Sighting Form */}
      {showEditSightingForm && selectedSighting && (
        <EditSightingForm
          sighting={selectedSighting}
          onSubmit={handleSubmitEditSighting}
          onCancel={() => {
            setShowEditSightingForm(false);
            setSelectedSighting(null);
          }}
        />
      )}

      {/* Observation Popup for viewing/editing/deleting sightings */}
      {selectedSighting && !showEditSightingForm && (
        <ObservationPopup
          observation={selectedSighting}
          onClose={() => setSelectedSighting(null)}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

export default SightingList;
