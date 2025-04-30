import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Contains buttons for actions (Add, Edit, Delete)
// Handles logic for adding, editing, and deleting sightings

function SightingActions() {
    const { user } = useOutletContext();
    const navigate = useNavigate();

    return (
        <div>

        </div>
    )
}

export default SightingActions;