// Custom React Hook for iNaturalist Data
// This hook manages the state and data fetching for iNaturalist API data

import { useState, useEffect } from "react";
import { searchFireflyObservations } from "../services/inaturalistApi";

// Custom hook to fetch and manage firefly observation data from iNaturalist
// params object contains query parameters to pass to the API
// per_page is the number of results per page (default is 20)
// page is the page number to fetch (default is 1)
// place_id is the ID of the place to filter by
// observed_on is the date of the observation to filter by
// returns an object containing data (the API response), loading state (a boolean indicating if the data is still being fetched), error state (an error message if the data is not fetched successfully), and refetch function (a function to manually refetch the data)

function useFireflyInaturalistData(params = {}) {
  // State to store the API response data
  const [data, setData] = useState(null);
  // State to track whether data is currently being fetched
  const [loading, setLoading] = useState(true);
  // State to store any error that occurs during fetching
  const [error, setError] = useState(null);

  // Function to fetch data from the iNaturalist API
  // This is separated from the useEffect to allow manual refetching (rather than re-fetching when the component mounts if it was in the useEffect)
  async function fetchFireflyData() {
    try {
      // Set loading state to true before fetching
      setLoading(true);

      // Call the API service function to get firefly observations
      console.log("API request parameters:", params);
      const result = await searchFireflyObservations(params);

      // Update state with the fetched data
      setData(result);

      // Clear any previous errors
      setError(null);

      console.log("Full API response:", result);
    } catch (err) {
      // If an error occurs, store the error message
      setError(err.message || "An error occurred while fetching data"); // updates the error state with the error message. If there is no message available from the error object, it will use the default message "An error occurred while fetching data"

      // Clear the data
      setData(null); // if there is an error, the data state is cleared to ensure the app doesn't display old or incorrect data
    } finally {
      // Set loading state to false when fetching is complete
      setLoading(false);
    }
  }

  // useEffect hook to fetch data when the component mounts or params change
  // The dependency array includes JSON.stringify(params) to ensure the effect - React's default behavior for objects is to compare their references, not their contents. By stringifying the params object, we ensure that the effect runs when any of the params change, not just when the params object reference changes
  useEffect(() => {
    fetchFireflyData();
  }, [JSON.stringify(params)]); // Re-fetch when params change

  // Return an object with the data, loading state, error state, and a function to manually refetch
  // This allows components using this hook to access all the necessary state and functions
  return {
    data,
    loading,
    error,
    refetchFireflyData: fetchFireflyData, // Expose the fetch function to allow manual refetching
  };
}

export { useFireflyInaturalistData };
