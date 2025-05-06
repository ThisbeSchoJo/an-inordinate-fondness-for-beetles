import { useState, useEffect } from "react";
import "../sightingform.css";

// This component handles the form for creating and editing sightings.
// It manages its own form state and handles form submission.

function SightingForm({ sighting, onSubmit, onCancel, isLoading }) {
  // Form state to manage input values
  const [formData, setFormData] = useState({
    species_id: "",
    location: "",
    timestamp: "",
    description: "",
    image: "",
    // user_id is automatically set from the user's session
  });

  // Initialize form data when sighting changes (for edit mode)
  useEffect(() => {
    if (sighting) {
      // If editing, populate form with sighting data
      setFormData({
        species_id: sighting.species_id,
        location: sighting.location,
        timestamp: sighting.timestamp,
        description: sighting.description,
        image: sighting.image,
      });
    } else {
      // If creating, reset form to empty values
      setFormData({
        species_id: "",
        location: "",
        timestamp: "",
        description: "",
        image: "",
      });
    }
  }, [sighting]);

  // Handle input changes
  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className="add-sighting-form">
      {/* Dynamic heading based on mode */}
      <h2 className="form-title">
        {sighting ? "Edit Sighting" : "Add New Sighting"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Species input */}
        <div className="form-group">
          <label className="form-label" htmlFor="species_id">
            Species:
          </label>
          <input
            className="form-input"
            type="text"
            id="species_id"
            name="species_id"
            value={formData.species_id}
            onChange={handleFormChange}
          />
        </div>
        {/* Location input */}
        <div className="form-group">
          <label className="form-label" htmlFor="location">
            Location:
          </label>
          <input
            className="form-input"
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleFormChange}
          />
        </div>
        {/* Timestamp input */}
        <div className="form-group">
          <label className="form-label" htmlFor="timestamp">
            Timestamp:
          </label>
          <input
            className="form-input"
            type="datetime-local"
            id="timestamp"
            name="timestamp"
            value={formData.timestamp}
            onChange={handleFormChange}
          />
        </div>
        {/* Description input */}
        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Description:
          </label>
          <textarea
            className="form-textarea"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
          />
        </div>
        {/* Image URL input */}
        <div className="form-group">
          <label className="form-label" htmlFor="image">
            Image URL:
          </label>
          <input
            className="form-input"
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleFormChange}
          />
        </div>
        {/* Submit and Cancel buttons */}
        <div className="form-group">
          <button className="submit-button" type="submit" disabled={isLoading}>
            {sighting ? "Save Changes" : "Add Sighting"}
          </button>
          <button
            className="submit-button secondary"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SightingForm;
