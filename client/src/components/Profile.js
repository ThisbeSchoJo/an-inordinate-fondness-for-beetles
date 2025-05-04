import "../profile.css";
import { useOutletContext } from "react-router-dom";

function Profile() {
  const { user } = useOutletContext();

  return (
    <div className="profile-container">
      <div className="profile-header">
        {/* <h1>Profile</h1> */}
      </div>
      <div className="profile-info">
          <div className="profile-picture">
            <img
              src={user ? `http://localhost:5555${user.profile_picture}` : "http://localhost:5555/static/uploads/default-profile-pic.png"}
              alt="Profile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "http://localhost:5555/static/uploads/default-profile-pic.png";
              }}
            />
          </div>
        <div className="info-item">
          {/* <strong>Username:</strong> */}
          <span>{user?.username || "Not logged in"}</span>
        </div>
      </div>
      <div className="profile-actions">
        {/* Add any profile actions here */}
      </div>
    </div>
  );
}

export default Profile;
