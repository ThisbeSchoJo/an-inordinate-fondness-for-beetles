/**
 * iNaturalist API Service
 * This file contains functions to interact with the iNaturalist API
 * Documentation: https://api.inaturalist.org/v1/docs/
 */

import axios from "axios";

// Base URL for the iNaturalist API v1
// This is the endpoint that all API requests will be made to
const API_BASE_URL = "https://api.inaturalist.org/v1";

//Create an axios instance with default configuration
// >> allows us to set common headers and base URL for all requests
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// searchFireflyObservations is an asynchronous API function that fetches firefly observations from iNaturalist API, with default filters set for fireflies, pagination, and sorting. You can override or extend the default parameters by passing a params object.
// params is an object with optional query parameters:
// taxon_id: The taxon ID for fireflies (Lampyridae)
// per_page: Number of results per page
// order_by: Sort order (desc or asc)
// order: Field to sort by
// page: Page number for pagination
// place_id: Filter by place ID
// observed_on: Filter by observation date
// Returns a promise that resolves to an object containing an array of observations (the API response)

async function searchFireflyObservations(params = {}) {
  try {
    // First, let's find the correct taxon_id for Lampyridae
    const taxaResponse = await searchFireflySpecies();
    const lampyridae = taxaResponse.results.find(
      (taxon) =>
        taxon.name.toLowerCase() === "lampyridae" && taxon.rank === "family"
    );

    if (!lampyridae) {
      throw new Error("Could not find Lampyridae taxon");
    }

    console.log("Found Lampyridae taxon:", lampyridae);

    // Default parameters for firefly search
    const defaultParams = {
      taxon_id: lampyridae.id, // Use the found taxon_id
      per_page: 20,
      order_by: "desc",
      order: "created_at",
      page: 1,
      ...params,
    };

    console.log("Searching iNaturalist with params:", defaultParams);
    const response = await api.get("/observations", { params: defaultParams });
    console.log("iNaturalist response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching firefly observations:", error);
    throw error;
  }
}

//Get detailed information about a specific observation
async function getObservationDetails(observationId) {
  // observationId is the ID of the observation to fetch
  try {
    const response = await api.get(`/observations/${observationId}`); // Make the API request to get a specific observation by ID
    return response.data; // Returns a promise that resolves to an object containing the observation details (the API response)
  } catch (error) {
    console.error(
      `Error fetching observation details for ID ${observationId}:`,
      error
    );
    throw error;
  }
}

// Search for firefly species (taxa) on iNaturalist
async function searchFireflySpecies(query = "Lampyridae") {
  try {
    const response = await api.get("/taxa", {
      params: {
        q: query,
        is_active: true,
        per_page: 20,
        rank: "family", // Search specifically at the family level
        locale: "en", // Ensure English names
      },
    });
    console.log("Firefly taxa search results:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error searching for firefly species:", error);
    throw error;
  }
}

//Get observations for a specific species
async function getObservationsBySpecies(taxonId, params = {}) {
  // params is an object with optional query parameters: (e.g., per_page, page, order_by, order, place_id, observed_on)
  try {
    const defaultParams = {
      taxon_id: taxonId, // taxonId is the ID of the species
      per_page: 20,
      ...params,
    };

    const response = await api.get("/observations", { params: defaultParams });
    return response.data; // Returns a promise that resolves to an object containing the observations (the API response)
  } catch (error) {
    console.error(`Error fetching observations for species ${taxonId}:`, error);
    throw error;
  }
}

// Function to search for places by name
async function searchPlaces(query) {
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
}

// Function to get observations near a specific location
async function getObservationsByLocation(lat, lng, radius = 10) {
  try {
    console.log("Searching observations near location:", { lat, lng, radius });
    const response = await api.get("/observations", {
      params: {
        taxon_id: 47731, // Lampyridae family
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
}

export {
  searchFireflyObservations,
  getObservationDetails,
  searchFireflySpecies,
  getObservationsBySpecies,
  searchPlaces,
  getObservationsByLocation,
};
