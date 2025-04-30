// This component displays firefly observations from iNaturalist on a map and in a list
// returns the FireflyObservations component

import React, { useState } from "react";
import { useFireflyInaturalistData } from "../hooks/useInaturalistData";
import Map from "./Map";
import "../FireflyObservations.css";

function FireflyObservations() {
  // State for pagination
  const [page, setPage] = useState(1);

  // State for filters
  const [filters, setFilters] = useState({
    place_id: "",
    observed_on: "",
  });

  // Create a filtered params object that only includes non-empty values
  const filteredParams = {page }
  if (filters.place_id) {
    filteredParams.place_id = filters.place_id;
  }
  if (filters.observed_on) {
    filteredParams.observed_on = filters.observed_on;
  }

  // Use the custom hook to fetch data with the current page and filters
  const { data, loading, error, refetch } = useFireflyInaturalistData(filteredParams);
  console.log("iNaturalist data:", data);

  // Prepare markers for the map from the observation data
  // Each marker represents a firefly observation with its location and title
  const markers =
    data?.results?.map((observation) => ({
      // if data is not null/undefined, and results is not null/undefined, map over the results and return an array of markers (observation is the current observation)
      position: {
        // Extract latitude and longitude from the observation's geojson
        // The coordinates in geojson are in [longitude, latitude] order
        lat: observation.geojson?.coordinates[1] || 0, // if lat coordinates are missing, return 0
        lng: observation.geojson?.coordinates[0] || 0, // if lng coordinates are missing, return 0
      },
      // Use the species guess as the marker title, or 'Unknown Firefly' if not available
      title: observation.species_guess || "Unknown Firefly",
      // Store the observation ID for reference
      id: observation.id,
    })) || []; // if data.results is null, return an empty array
    console.log("Markers:", markers);


  // Calculate the center of the map
  const center =
    markers.length > 0 ? markers[0].position : { lat: 40.7128, lng: -74.006 }; // If there is at least 1 marker, use the first marker's position. Default to NYC if no observations

  // Handle page navigation
  function handlePageChange(direction) {
    // direction param is a string that is either 'next' or 'prev'
    if (direction === "next" && data?.total_results > page * data?.per_page) {
      // if direction is 'next' and there are more results than the current page * the number of results per page...
      setPage(page + 1); // then set the page to the next page
    } else if (direction === "prev" && page > 1) {
      // if direction is 'prev' and the current page is greater than 1...
      setPage(page - 1); // then set the page to the previous page
    }
  }

  // Handle filter changes - trigger when the user changes the filter values
  function handleFilterChange(e) {
    // e is the change event
    const { name, value } = e.target; // name is the name of the input field (e.g., place_id, observed_on), value is the value of the input field (e.g., the location or date the user entered)
    setFilters((prev) => ({
      // update the filters with the new value
      ...prev, // keep all the previous filters (so you can stack on filters and narrow down results)
      [name]: value, // update the filter with the new value
    }));
    // Reset to page 1 when filters change
    setPage(1);
  }

  // Handle filter form submission
  function handleFilterSubmit(e) {
    // e is the form submission event
    e.preventDefault(); // prevent the default behavior of the form (e.g., refreshing the page)
    refetch(); // refetch the data with the new filters
  }

  // Show loading state while data is being fetched
  if (loading)
    return <div className="loading">Loading firefly observations...</div>;

  // Show error state if there was an error fetching data
  if (error) return <div className="error">Error: {error}</div>;

  // Show message if no observations were found
  if (!data?.results?.length)
    //include ".length" to check if the results array is empty (and not just null/undefined)
    return <div className="no-results">No firefly observations found.</div>;

  return (
    <div className="firefly-observations">
      <h1>Firefly Observations</h1>

      {/* Filter form */}
      <div className="filters">
        <form onSubmit={handleFilterSubmit}>
          <div className="filter-group">
            <label htmlFor="place_id">Location:</label>
            <input
              type="text"
              id="place_id"
              name="place_id"
              value={filters.place_id}
              onChange={handleFilterChange}
              placeholder="Enter place ID"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="observed_on">Date:</label>
            <input
              type="date"
              id="observed_on"
              name="observed_on"
              value={filters.observed_on}
              onChange={handleFilterChange}
            />
          </div>
          <button type="submit">Apply Filters</button>
        </form>
      </div>

      {/* Map container */}
      <div className="map-container">
        <Map center={center} markers={markers} />
      </div>

      {/* Observations list */}
      <div className="observations-list">
        <h2>Recent Observations</h2>

        {/* Page controls */}
        <div className="pagination">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={page === 1}
          >
            {" "}
            Previous{" "}
          </button>
          <span>Page {page}</span>
          {/* Disable the next button if there are no more results or if the current page is greater than the total number of results divided by the number of results per page (aka to get the total number of pages) */}
          <button
            onClick={() => handlePageChange("next")}
            disabled={
              !data?.total_results || data.total_results <= page * data.per_page
            }
          >
            {" "}
            Next{" "}
          </button>
        </div>

        {/* List of observations */}
        <ul>
          {data.results.map(
            (
              observation // for each observation in the results array, return a list item (show species guess, observed on, location, and first photo if available)
            ) => (
              <li key={observation.id} className="observation-item">
                <h3>{observation.species_guess || "Unknown Firefly"}</h3>
                <p>
                  {" "}
                  Observed on:{" "}
                  {/* "new" is a Date constructor - makes a new instance of the Date object */}
                  {new Date(observation.observed_on).toLocaleDateString()}
                  {/* takes date string from API and turns it into a Date object that JavaScript can understand and then formats it as a string */}
                </p>
                <p>Location: {observation.place_guess || "Unknown location"}</p>

                {/* Display the first photo if available */}
                {/* checks if at least one photo is available, checks if the first photo has a url, and if so, displays the photo */}
                {observation.photos?.[0]?.url && (
                  // replace "square" with "medium" to get a larger photo
                  <img
                    src={observation.photos[0].url.replace("square", "medium")}
                    alt={observation.species_guess || "Firefly"}
                    className="observation-image"
                  />
                )}

                {/* Link to the observation on iNaturalist */}
                <a
                  href={`https://www.inaturalist.org/observations/${observation.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-on-inaturalist"
                >
                  View on iNaturalist
                </a>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export default FireflyObservations;
