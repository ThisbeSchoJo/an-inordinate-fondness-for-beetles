import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

// This component displays a list of all firefly sightings and provides
// functionality to add, edit, and delete sightings. It handles authentication
// to ensure users can only modify their own sightings.

function SightingList() {
  // State variables to manage component data and UI state
  const [sightings, setSightings] = useState([]); // Stores all sightings fetched from the API
  const [isLoading, setIsLoading] = useState(true); // Tracks loading state during API requests
  const [error, setError] = useState(null); // Stores any error messages to display to the user
  const [formData, setFormData] = useState({
    // Form data for creating or editing sightings
    species_id: "",
    location: "",
    timestamp: "",
    description: "",
    image: "",
  });
  const [selectedSighting, setSelectedSighting] = useState(null); // Currently selected sighting for editing/deleting
  const [isEditing, setIsEditing] = useState(false); // Tracks whether the user is in edit mode
  const { user } = useOutletContext(); // Gets the current user from the auth context
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Fetch sightings when the component mounts
  useEffect(() => {
    fetchSightings();
  }, []);

  // Handles deleting sighting
  async function handleDelete(id) {
    // If user is not logged in, navigate to login page
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);

      // Send DELETE request to the API
      const response = await fetch(`http://localhost:5000/sightings/${id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        // User is not authenticated
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        // User doesn't have permission
        setError("You don't have permission to delete this sighting");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete sighting");
      }

      // Refresh the sightings list
      fetchSightings();
      setSelectedSighting(null);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  // Sets up the form for editing a sighting
  function handleEdit(id) {
    // Check if user is logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // Find the sighting to edit
    const sightingToEdit = sightings.find((s) => s.id === id);
    if (!sightingToEdit) {
      setError("Sighting not found");
      return;
    }

    // Set the form data to the sighting data
    setFormData({
      species_id: sightingToEdit.species_id,
      location: sightingToEdit.location,
      timestamp: sightingToEdit.timestamp,
      description: sightingToEdit.description,
      image: sightingToEdit.image,
    });

    // Set the selected sighting and editing state
    setSelectedSighting(sightingToEdit);
    setIsEditing(true);
  }

  // Handles the API request to update a sighting
  async function handleEditSubmit(e) {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Send PATCH request to update the sighting
      const response = await fetch(
        `http://localhost:5000/sightings/${selectedSighting.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 401) {
        // User is not authenticated
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        // User doesn't have permission
        setError("You don't have permission to edit this sighting");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit sighting");
      }

      // Refresh the sightings list and reset form
      fetchSightings();
      setIsEditing(false);
      setSelectedSighting(null);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }

  // Function to handle form changes
  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  // Function to cancel editing
  function handleCancelEdit() {
    setIsEditing(false);
    setSelectedSighting(null);
    setError(null);
  }

  // Function to handle adding a new sighting
  function handleAdd() {
    // This function will be implemented to handle adding a new sighting
  }

  // Function to fetch sightings
  function fetchSightings() {
    // This function will be implemented to fetch sightings from the API
  }

  return (
    <div>
      <h1> Sighting List</h1>

      {/* Conditional rendering based on edit mode */}
      {isEditing ? (
        <SightingForm />
      ) : (
        // Action buttons displayed when not in edit mode
        <SightingActions />
      )}

      {/* Display error messages if any */}
      {error && <p className="error">{error}</p>}
      {/* Display loading indicator when fetching data */}
      {isLoading && <p>Loading...</p>}

      {/* Sightings list will be displayed here */}
    </div>
  );
}

export default SightingList;
