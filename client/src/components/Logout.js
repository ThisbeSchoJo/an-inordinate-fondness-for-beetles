import { useOutletContext } from "react-router-dom";

function Logout() {
    const { updateUser } = useOutletContext();
    const navigate = useNavigate();

    function handleLogout() {
        updateUser(null);
        navigate("/login");
    }
    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Logout;