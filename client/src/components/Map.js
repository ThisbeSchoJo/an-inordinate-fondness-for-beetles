/**
 * Map Component
 * Displays a Google Map with markers for firefly observations
 */

import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "../map.css";

// The "marker" library is required for marker functionality
const libraries = ["marker"];

function Map({ center, markers = [], zoom = 10, onMarkerClick }) {
  // Load the Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <div className="map-container">
      <GoogleMap
        // Set the map container style to take full width and height of the parent div
        mapContainerStyle={{ width: "100%", height: "100%" }}
        // Set the initial center and zoom level of the map
        center={center}
        zoom={zoom}
        // Disable map type and street view controls because doesn't make sense for this app
        options={{
          mapTypeControl: false,
          streetViewControl: false,
        }}
      >
        {/* Render markers for each observation */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.title || "Unknown"}
            onClick={() => onMarkerClick?.(marker)}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

export default Map;
