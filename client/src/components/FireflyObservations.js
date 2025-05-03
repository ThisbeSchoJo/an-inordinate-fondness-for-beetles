// This component displays firefly observations from iNaturalist on a map and in a list
// returns the FireflyObservations component

import React, { useState, useEffect } from "react";
import Map from "./Map";
import { getObservationsByLocation } from "../services/inaturalistApi";
import "../FireflyObservations.css";

function FireflyObservations() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [markers, setMarkers] = useState([]);

  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(error.message);
          setIsLoadingLocation(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
    }
  }, []);

  // Fetch observations when user location is available
  useEffect(() => {
    if (userLocation) {
      const fetchNearbyObservations = async () => {
        try {
          const data = await getObservationsByLocation(
            userLocation.lat,
            userLocation.lng
          );
          console.log("iNaturalist data:", data);

          const newMarkers = data.results.map((observation) => {
            // Parse the location string into numbers
            const [lat, lng] = observation.location
              .split(",")
              .map((coord) => parseFloat(coord.trim()));

            return {
              id: observation.id,
              position: {
                lat,
                lng,
              },
              title: observation.species_guess || "Firefly",
              description: observation.description || "Firefly observation",
            };
          });

          console.log("Markers:", newMarkers);
          setMarkers(newMarkers);
        } catch (error) {
          console.error("Error fetching observations:", error);
        }
      };

      fetchNearbyObservations();
    }
  }, [userLocation]);

  if (isLoadingLocation) {
    return <div className="loading">Getting your location...</div>;
  }

  if (locationError) {
    return <div className="error">Error: {locationError}</div>;
  }

  return (
    <div className="firefly-observations">
      <h2>Firefly Observations Near You</h2>
      {userLocation && (
        <div className="map-container">
          <Map center={userLocation} markers={markers} zoom={10} />
        </div>
      )}
    </div>
  );
}

export default FireflyObservations;
