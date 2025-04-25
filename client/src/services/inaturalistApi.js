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

async function searchFireflyObservations(params = {}) { // export const is used to define and export the function from the file (so it can be used in other files). "async" is used to define an asynchronous function - so it can wait for the API response (you can use "await" inside the function). "params = {}" sets a default parameter of an empty object if no parameters are passed in.
  try {
    // Default parameters for firefly search
    const defaultParams = {
      taxon_id: 48073, // The taxon_id 48073 corresponds to the Lampyridae family (fireflies)
      per_page: 20, // The per_page is set to 20, which is the maximum allowed by the API
      order_by: "desc", // The order_by is set to desc, which means the observations are sorted by date in descending order
      order: "created_at", // The order is set to created_at, which means the observations are sorted by date (most recent first)
      page: 1, // The page is set to 1, which means the first page of results is returned
      ...params, // The ...params is used to allow for additional query parameters to be passed in
    };

    // the api.get() method makes the API request to the "/observations" endpoint
    // the { params: defaultParams } object is used to pass in the query parameters.
    // The response variable will include an array of observation objects - each representing a firefly observation (stored in the 'results' property of the response)
    const response = await api.get("/observations", { params: defaultParams });
    return response.data; // returns just the data from the API response object (which will include the 'results' array of observation objects)
  } catch (error) {
    // Log the error and rethrow it to be handled by the caller
    console.error("Error fetching firefly observations:", error);
    throw error;
  }
};

//Get detailed information about a specific observation
async function getObservationDetails(observationId) { // observationId is the ID of the observation to fetch
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
};

// Search for firefly species (taxa) on iNaturalist
async function searchFireflySpecies(query = "firefly") {
  try {
    const response = await api.get("/taxa", { //makes a GET request to the "/taxa" endpoint
      params: { //params that will get converted into a URL query string
        q: query, //query parameter for the search query (default is "firefly") 
        is_active: true, //only active species are returned (not deprecated or extinct)
        per_page: 10, // limits number of results to 10
      },
    });
    return response.data; // Returns a promise that resolves to an object containing the taxa results (the API response)
  } catch (error) {
    console.error("Error searching for firefly species:", error);
    throw error;
  }
};

//Get observations for a specific species
async function getObservationsBySpecies(taxonId, params = {}) { // params is an object with optional query parameters: (e.g., per_page, page, order_by, order, place_id, observed_on)
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
};


export { searchFireflyObservations, getObservationDetails, searchFireflySpecies, getObservationsBySpecies };