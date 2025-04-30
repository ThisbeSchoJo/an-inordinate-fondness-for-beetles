import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Form for creating or editing sightings
// Manages form state and validation
// Handles form submission
// Displays error messages if validation fails


function SightingForm() {
    const { user } = useOutletContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        species_id: "",
        location: "",
        timestamp: "",
        description: "",
        image: "",
    });
    const [selectedSighting, setSelectedSighting] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    return (
        // Edit form that will bedisplayed when in edit mode
        <div>
          <h2>Edit Sighting</h2>
          <form onSubmit={handleEditSubmit}>
            <div>
              <label htmlFor="species_id">Species:</label>
              <input
                type="text"
                id="species_id"
                name="species_id"
                value={formData.species_id}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label htmlFor="timestamp">Timestamp:</label>
              <input
                type="datetime-local"
                id="timestamp"
                name="timestamp"
                value={formData.timestamp}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label htmlFor="image">Image URL:</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleFormChange}
              />
            </div>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          </form>
        </div>
    )
}

export default SightingForm;