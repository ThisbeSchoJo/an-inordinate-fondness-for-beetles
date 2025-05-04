/**
 * ObservationPopup Component
 * Displays details of a selected observation in a centered popup
 */

import React from "react";
import "../observation-popup.css";

function ObservationPopup({ observation, onClose }) {
  if (!observation) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>{observation.species_guess || "Unknown Firefly"}</h2>
        {/* Display the first photo if available */}
        {observation.photos?.[0]?.url && (
          <img
            src={observation.photos[0].url}
            alt={observation.species_guess || "Firefly observation"}
          />
        )}
        <div className="observation-details">
          <p>
            <strong>Date:</strong> {observation.observed_on}
          </p>
          <p>
            <strong>Location:</strong> {observation.place_guess || "Unknown"}
          </p>
          {/* Display the description if available */}
          {observation.description && (
            <p>
              <strong>Notes:</strong> {observation.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ObservationPopup;
