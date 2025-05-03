/**
 * useInaturalistData Hook
 * This custom React hook manages the state and data fetching for iNaturalist API data.
 * It provides a simple interface for components to fetch and display firefly observations.
 */

import { useState, useEffect } from "react";
import {
  getObservationsByLocation,
  searchFireflySpecies,
  getObservationsBySpecies,
  searchFireflyObservations,
  getObservationDetails,
} from "../services/inaturalistApi";

/**
 * Custom hook for fetching and managing firefly observation data from iNaturalist
 * @param {Object} params - Query parameters for the search
 * @param {number} params.lat - Latitude for location-based search
 * @param {number} params.lng - Longitude for location-based search
 * @param {number} params.radius - Search radius in kilometers
 * @returns {Object} - Object containing data, loading state, error state, and refetch function
 */
export const useFireflyInaturalistData = (params = {}) => {
  // State management for API response data
  const [data, setData] = useState(null); // Stores the fetched observations
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(null); // Stores any error messages

  /**
   * Function to fetch firefly observations from the iNaturalist API
   * Handles loading and error states appropriately
   */
  const fetchFireflyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchFireflyObservations(params);
      setData(response);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching firefly data:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * useEffect hook to trigger data fetching
   * Runs when the component mounts or when the query parameters change
   */
  useEffect(() => {
    fetchFireflyData();
  }, [params.lat, params.lng, params.radius]);

  // Return the data and utility functions
  return {
    data,
    loading,
    error,
    refetch: fetchFireflyData, // Function to manually trigger a refetch
  };
};

/**
 * Custom hook for fetching and managing observation details from iNaturalist
 * @param {number} observationId - The ID of the observation to fetch
 * @returns {Object} - Object containing observation details, loading state, and error state
 */
export const useObservationDetails = (observationId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!observationId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getObservationDetails(observationId);
        setData(response);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching observation details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [observationId]);

  return { data, loading, error };
};

/**
 * Custom hook for fetching and managing firefly species data from iNaturalist
 * @param {Object} params - Query parameters for the species search
 * @returns {Object} - Object containing species data, loading state, and error state
 */
export const useFireflySpecies = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await searchFireflySpecies(params);
        setData(response);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching firefly species:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [params.q, params.rank]);

  return { data, loading, error };
};

/**
 * Custom hook for fetching and managing observations by species from iNaturalist
 * @param {number} speciesId - The ID of the species to fetch observations for
 * @param {Object} params - Additional query parameters
 * @returns {Object} - Object containing observations, loading state, and error state
 */
export const useObservationsBySpecies = (speciesId, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchObservations = async () => {
      if (!speciesId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getObservationsBySpecies(speciesId, params);
        setData(response);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching observations by species:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchObservations();
  }, [speciesId, params.per_page, params.order_by]);

  return { data, loading, error };
};
