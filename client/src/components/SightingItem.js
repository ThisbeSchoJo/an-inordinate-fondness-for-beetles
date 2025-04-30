// This component displays a single sighting item in the list.
// It handles the display of sighting details and selection state.

import { useState } from "react";

function SightingItem({ sighting, isSelected, onSelect }) {
  // Local state for loading and error handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    // Container with conditional class for selected state
    <div
      className={`sighting-item ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      {/* Display sighting details */}
      <h3>{sighting.species.name}</h3>
      <p>Location: {sighting.location}</p>
      <p>Date: {new Date(sighting.timestamp).toLocaleDateString()}</p>
      <p>Description: {sighting.description}</p>
      {/* Conditionally render image if available */}
      {sighting.image && (
        <img src={sighting.image} alt={sighting.species.name} />
      )}
      {/* Display any errors */}
      {error && <p className="error">{error}</p>}
      {/* Display loading state */}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

export default SightingItem;
