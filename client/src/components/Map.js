import React, { useEffect, useRef } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "../map.css";

// The "marker" library is required for marker functionality
const libraries = ["marker"];

//Map Component renders a Google Map with optional markers
// Props:
// - center: an object like { lat: number, lng: number } to center the map
// - markers: an array of objects with:
//     - position: { lat, lng }
//     - title: string shown on the marker

function Map({ center, markers }) {
  // Create a ref to store the map instance
  // useRef is a React Hook that creates an object that can be used to store a reference to a DOM element and won't re-render when the element is updated
  const mapRef = useRef();

  // Define the onLoad function that will be called when the map is loaded
  const onLoad = (map) => {
    // Store the map instance in the ref
    mapRef.current = map;
  };

  // useLoadScript is a custom hook from @react-google-maps/api
  // It handles loading the Google Maps JavaScript API
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

  // Render the Google Map component
  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        // Center the map on the provided coordinates
        center={center}
        // Set the initial zoom level (10 is a good default for city-level view)
        zoom={10}
        // Call onLoad when the map is ready
        onLoad={onLoad}
      >
        {/* Render markers if they exist */}
        {markers
          ? markers.map((marker, index) => (
              // Create a div for each marker
              <Marker
                key={index}
                position={marker.position}
                title={marker.title}
              />
            ))
          : null}
      </GoogleMap>
    </div>
  );
}

export default Map;
