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
      <p>Location: {sighting.place_guess}</p> 
      <p>Date: {new Date(sighting.observed_on).toLocaleDateString()}</p>
      <p>Description: {sighting.description}</p>
      {/* Conditionally render image if available */}
      {sighting.photos && (
        <img src={sighting.photos} alt={sighting.species.name} />
      )}
      {/* Display any errors */}
      {error && <p className="error">{error}</p>}
      {/* Display loading state */}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

export default SightingItem;
