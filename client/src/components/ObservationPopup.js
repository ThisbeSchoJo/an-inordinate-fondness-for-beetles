/**
 * ObservationPopup Component
 * Displays details of a selected observation in a centered popup
 * Can show both iNaturalist observations and user-submitted sightings
 */

import React from "react";
import "../observation-popup.css";

function ObservationPopup({ observation, onClose, onDelete, onEdit }) {
  // If no observation is provided, don't render anything
  if (!observation) return null;

  // Debug logs to help track data structure
  console.log("Full observation object:", observation);
  console.log("Species data:", observation.species);
  console.log("Species guess:", observation.species_guess);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button in the top-right corner */}
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        {/* Title showing either species_guess or species name */}
        <h2>
          {observation.species_guess?.trim() ||
            observation.species?.name ||
            "Unknown Firefly"}
        </h2>

        {/* Display the first photo if available */}
        {observation.photos?.[0]?.url && (
          <img
            src={observation.photos[0].url}
            alt={observation.species_guess || "Firefly observation"}
          />
        )}

        {/* Observation details section */}
        <div className="observation-details">
          {/* Date of observation */}
          <p>
            <strong>Date:</strong> {observation.observed_on}
          </p>

          {/* Location of observation */}
          <p>
            <strong>Location:</strong> {observation.place_guess || "Unknown"}
          </p>

          {/* Optional description/notes */}
          {observation.description && (
            <p>
              <strong>Notes:</strong> {observation.description}
            </p>
          )}

          {/* Action buttons - only show for user's own sightings */}
          {observation.user_id && (
            <>
              <button onClick={() => onDelete(observation.id)}>
                Delete Sighting
              </button>
              <button onClick={() => onEdit(observation.id)}>
                Edit Sighting
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ObservationPopup;
