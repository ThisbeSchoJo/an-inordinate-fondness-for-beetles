import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

/**
 * SightingList Component
 *
 * This component displays a list of all firefly sightings and provides
 * functionality to add, edit, and delete sightings. It handles authentication
 * to ensure users can only modify their own sightings.
 */
function SightingList() {
  const [sightings, setSightings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    species_id: "",
    location: "",
    timestamp: "",
    description: "",
    image: "",
  });
  const [selectedSighting, setSelectedSighting] = useState(null);
  const navigate = useNavigate();
  const { user } = useOutletContext();

  useEffect(() => {
    fetchSightings();
  }, []);

// Handles deleting sighting 
  async function handleDelete(id) {
    try {
      setIsLoading(true);
      setError(null);

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


  function handleEdit(id) {
    // This function will be implemented to handle editing a sighting
  }


  function handleAdd() {
    // This function will be implemented to handle adding a new sighting
  }


  function fetchSightings() {
    // This function will be implemented to fetch sightings from the API
  }

  return (
    <div>
      <h1> Sighting List</h1>
      <button onClick={() => handleDelete(selectedSighting?.id)}>Delete</button>
      <button onClick={() => handleEdit(selectedSighting?.id)}>Edit</button>
      <button onClick={() => handleAdd()}>Add</button>
    </div>
  );
}

export default SightingList;
