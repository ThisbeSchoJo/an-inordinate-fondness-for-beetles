import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Renders buttons for actions (Add, Edit, Delete)
// Handles logic for adding, editing, and deleting sightings

// Function to handle adding a new sighting
function handleAdd() {
  setSelectedSighting(null);
  setIsEditing(true);
}

// Function to handle editing a sighting
function handleEdit(id) {
  const sightingToEdit = sightings.find((s) => s.id === id);
  if (!sightingToEdit) {
    setError("Sighting not found");
    return;
  }
  setSelectedSighting(sightingToEdit);
  setIsEditing(true);
}

// Handles the API request to update a sighting
async function handleEditSubmit(formData) {
  try {
    setIsLoading(true);
    setError(null);

    const response = await fetch(
      `http://localhost:5000/sightings/${selectedSighting.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.status === 401) {
      navigate("/login");
      return;
    }

    if (response.status === 403) {
      setError("You don't have permission to edit this sighting");
      return;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to edit sighting");
    }

    fetchSightings();
    setIsEditing(false);
    setSelectedSighting(null);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
}

// Function to cancel editing
function handleCancelEdit() {
  setIsEditing(false);
  setSelectedSighting(null);
  setError(null);
}

// Handles deleting sighting
async function handleDelete(id) {
  try {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`http://localhost:5000/sightings/${id}`, {
      method: "DELETE",
    });

    if (response.status === 401) {
      navigate("/login");
      return;
    }

    if (response.status === 403) {
      setError("You don't have permission to delete this sighting");
      return;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete sighting");
    }

    fetchSightings();
    setSelectedSighting(null);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
}

// This component renders the action buttons for the sightings feature.
// It receives action handlers as props and renders the appropriate buttons based on selection state.
function SightingActions({ onAdd, onDelete, onEdit, selectedSighting }) {
  return (
    <div className="sighting-actions">
      {/* Always show the Add button */}
      <button onClick={onAdd}>Add New Sighting</button>
      {/* Only show Delete and Edit buttons when a sighting is selected */}
      {selectedSighting && (
        <div>
          <button onClick={onDelete}>Delete</button>
          <button onClick={onEdit}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default SightingActions;
