import "../profile.css";
import { useOutletContext } from "react-router-dom";

function Profile() {
  const { user } = useOutletContext();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>
      <div className="profile-info">
        <div className="info-item">
          <strong>Username:</strong>
          <span>{user?.username || "Not logged in"}</span>
        </div>
        {user?.profilePicture && (
          <div className="info-item">
            <strong>Profile Picture:</strong>
            <img src={user.profilePicture} alt="Profile" />
          </div>
        )}
      </div>
      <div className="profile-actions">
        {/* Add any profile actions here */}
      </div>
    </div>
  );
}

export default Profile;
