import React, { useState, useEffect } from "react";
import Map from "./Map";

function UserSightings() {
  const [sightings, setSightings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const response = await fetch("http://localhost:5555/sightings", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch sightings");
        }
        const data = await response.json();
        setSightings(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchSightings();
  }, []);

  return { sightings, isLoading, error };
}

export default UserSightings;
