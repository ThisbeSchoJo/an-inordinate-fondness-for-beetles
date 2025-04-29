import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

function SightingList() {

    const [sightings, setSightings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        species_id: "",
        location: "",
        timestamp: "",
        description: "",
        image: ""
    })
    const [selectedSighting, setSelectedSighting] = useState(null);
    const navigate = useNavigate();
    const { user } = useOutletContext();

    useEffect(() => {
        fetchSightings();
    }, []);

    
    return (
        <div>
            <h1> Sighting List</h1>
            <button onClick={() => handleDelete(selectedSighting?.id)}>Delete</button>
            <button onClick={() => handleEdit(selectedSighting?.id)}>Edit</button>
            <button onClick={() => handleAdd()}>Add</button>
        </div>
    )
}

export default SightingList;