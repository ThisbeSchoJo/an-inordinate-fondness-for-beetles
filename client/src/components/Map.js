import React, { useEffect, useRef } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
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
  // This allows us to access the map object throughout the component
  // mapRef is a reference to the map instance
  // null is the initial value of the ref
  const mapRef = useRef(null);

  // useLoadScript is a custom hook from @react-google-maps/api
  // It handles loading the Google Maps JavaScript API - it tells you if the API is loaded or not (isLoaded) and if there's an error (loadError)
  const { isLoaded, loadError } = useLoadScript({
    // The API key from your .env file (must start with REACT_APP_ for Create React App to recognize it
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    // Specify which libraries to load
    libraries,
  });

  // If there's an error loading the Google Maps API, show an error message
  if (loadError) {
    return <div>Error loading maps</div>;
  }

  // While the API is loading, show a loading message
  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  // onLoad is a callback function that runs when the map is loaded
  // Stores the map instance in our ref for later use
  // map is the map instance
  // mapRef.current is the map instance
  function onLoad(map){
    mapRef.current = map;
  };

  // Render the Google Map component
  return (
    <div className="map-container">
        <GoogleMap
        // Center the map on the provided coordinates
        center={center}
        // Set the initial zoom level (10 is a good default for city-level view)
        zoom={10}
        // Call onLoad when the map is ready
        onLoad={onLoad}
        >
        {/* Render markers if they exist */}
        { markers ? (
            markers.map((marker, index) => (
                // Create a div for each marker
                <div key={index} className="marker">
                    {/* Display the marker title */}
                    {marker.title}
                </div>
            ))
        ) : null}
        </GoogleMap>
    </div>
  );
};

export default Map;
