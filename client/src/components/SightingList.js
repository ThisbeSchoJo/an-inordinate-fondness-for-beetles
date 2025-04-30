// SightingList is the coordinator for the sightings list
// it manages the main state, coordinates with the SightingActions, SightingForm, and SightingItem components
// it also handles the fetching of sightings from the API

import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import SightingItem from "./SightingItem";
import SightingActions from "./SightingActions";
import SightingForm from "./SightingForm";

function SightingList() {
  // State variables to manage component data and UI state
  const [sightings, setSightings] = useState([]); // Stores all sightings fetched from the API
  const [isLoading, setIsLoading] = useState(true); // Tracks loading state during API requests
  const [error, setError] = useState(null); // Stores any error messages to display to the user
  const [selectedSighting, setSelectedSighting] = useState(null); // Currently selected sighting for editing/deleting
  const [isEditing, setIsEditing] = useState(false); // Tracks whether the user is in edit mode
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Fetch sightings when the component mounts
  useEffect(() => {
    fetchSightings();
  }, []);

  // Function to fetch sightings from the API
  async function fetchSightings() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("http://localhost:5000/sightings");
      if (!response.ok) {
        throw new Error("Failed to fetch sightings");
      }
      const data = await response.json();
      setSightings(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1>Sighting List</h1>

      {/* Conditional rendering based on edit mode */}
      {isEditing ? (
        // When in edit mode, show the form for adding/editing sightings
        <SightingForm
          sighting={selectedSighting}
          onSubmit={handleEditSubmit}
          onCancel={handleCancelEdit}
          isLoading={isLoading}
        />
      ) : (
        // When not in edit mode, show the list of sightings and action buttons
        <>
          <SightingActions
            onAdd={handleAdd}
            onDelete={() => handleDelete(selectedSighting?.id)}
            onEdit={() => handleEdit(selectedSighting?.id)}
            selectedSighting={selectedSighting}
          />
          {error && <p className="error">{error}</p>}
          {isLoading && <p>Loading...</p>}
          <div className="sightings-grid">
            {sightings.map((sighting) => (
              <SightingItem
                key={sighting.id}
                sighting={sighting}
                isSelected={selectedSighting?.id === sighting.id}
                onSelect={() => setSelectedSighting(sighting)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SightingList;
