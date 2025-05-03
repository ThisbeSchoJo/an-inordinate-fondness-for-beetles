/**
 * iNaturalist API Service
 * This service provides functions to interact with the iNaturalist API
 * for fetching firefly observations and related data.
 */

import axios from "axios";

// Base URL for the iNaturalist API
const BASE_URL = "https://api.inaturalist.org/v1";

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: BASE_URL,
});

/**
 * Search for firefly observations
 * @param {Object} params - Query parameters for the search
 * @param {number} params.lat - Latitude for location-based search
 * @param {number} params.lng - Longitude for location-based search
 * @param {number} params.radius - Search radius in kilometers
 * @param {string} params.quality_grade - Quality grade filter (e.g., "research")
 * @param {boolean} params.photos - Whether to include only observations with photos
 * @returns {Promise} - Promise resolving to the API response
 */
export const searchFireflyObservations = async (params = {}) => {
  try {
    // Default parameters for firefly search
    const defaultParams = {
      taxon_id: 48073, // Lampyridae (fireflies) taxon ID
      per_page: 100,
      order_by: "observed_on",
      order: "desc",
      quality_grade: "research",
      photos: true,
    };

    // Merge default parameters with provided parameters
    const queryParams = { ...defaultParams, ...params };

    // Log the search parameters for debugging
    console.log("Searching firefly observations with params:", queryParams);

    // Make the API request
    const response = await api.get("/observations", { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("Error searching firefly observations:", error);
    throw error;
  }
};

/**
 * Get details for a specific observation
 * @param {number} id - The observation ID
 * @returns {Promise} - Promise resolving to the observation details
 */
export const getObservationDetails = async (id) => {
  try {
    const response = await api.get(`/observations/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting observation details:", error);
    throw error;
  }
};

/**
 * Search for firefly species
 * @param {Object} params - Query parameters for the search
 * @returns {Promise} - Promise resolving to the species search results
 */
export const searchFireflySpecies = async (params = {}) => {
  try {
    const defaultParams = {
      q: "Lampyridae",
      rank: "family",
      per_page: 20,
      locale: "en",
    };

    const queryParams = { ...defaultParams, ...params };
    console.log("Searching firefly species with params:", queryParams);

    const response = await api.get("/taxa", { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("Error searching firefly species:", error);
    throw error;
  }
};

/**
 * Get observations by species ID
 * @param {number} speciesId - The species ID
 * @param {Object} params - Additional query parameters
 * @returns {Promise} - Promise resolving to the observations for the species
 */
export const getObservationsBySpecies = async (speciesId, params = {}) => {
  try {
    const defaultParams = {
      per_page: 100,
      order_by: "observed_on",
      order: "desc",
    };

    const queryParams = { ...defaultParams, ...params };
    console.log(`Getting observations for species ${speciesId}:`, queryParams);

    const response = await api.get(`/observations`, {
      params: { ...queryParams, taxon_id: speciesId },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting observations by species:", error);
    throw error;
  }
};

/**
 * Search for places by name
 * @param {string} query - The search query for places
 * @returns {Promise} - Promise resolving to the places search results
 */
export const searchPlaces = async (query) => {
  try {
    console.log("Searching places with query:", query);
    const response = await api.get("/places", {
      params: {
        q: query,
        per_page: 5,
        order_by: "area",
        order: "desc",
      },
    });
    console.log("Places API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error searching places:", error);
    throw error;
  }
};

/**
 * Get observations near a specific location
 * @param {number} lat - Latitude of the location
 * @param {number} lng - Longitude of the location
 * @param {number} radius - Search radius in kilometers (default: 10)
 * @returns {Promise} - Promise resolving to the observations near the location
 */
export const getObservationsByLocation = async (lat, lng, radius = 10) => {
  try {
    console.log("Searching observations near location:", { lat, lng, radius });
    const response = await api.get("/observations", {
      params: {
        taxon_id: 48073, // Lampyridae family
        lat: lat,
        lng: lng,
        radius: radius, // radius in kilometers
        per_page: 20,
        order_by: "desc",
        order: "created_at",
      },
    });
    console.log("Location-based observations response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching location-based observations:", error);
    throw error;
  }
};
