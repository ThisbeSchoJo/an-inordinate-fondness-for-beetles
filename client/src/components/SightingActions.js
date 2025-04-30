import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Contains buttons for actions (Add, Edit, Delete)
// Handles logic for adding, editing, and deleting sightings

function SightingActions() {
    const { user } = useOutletContext();
    const navigate = useNavigate();
    const [selectedSighting, setSelectedSighting] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    return (
        // Action buttons displayed when not in edit mode
        <div>
          <button onClick={() => handleAdd()}>Add New Sighting</button>
          {selectedSighting && (
            <div>
              <button onClick={() => handleDelete(selectedSighting.id)}>
                {" "}
                Delete{" "}
              </button>
              <button onClick={() => handleEdit(selectedSighting.id)}>
                {" "}
                Edit{" "}
              </button>
            </div>
          )}
        </div>
    )
}

export default SightingActions;