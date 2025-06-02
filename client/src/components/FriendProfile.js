import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../profile.css";

function FriendProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [friendData, setFriendData] = useState(null);
  const [sightingsCount, setSightingsCount] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5555/profile/${userId}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setFriendData(data);
        setSightingsCount(data.sightings?.length || 0);
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, [userId]);

  return (
    <div className="profile-container">
      <div className="profile-info">
        <div className="profile-picture">
          <img
            src={
              friendData?.profile_picture
                ? `http://localhost:5555${friendData.profile_picture}`
                : "http://localhost:5555/static/uploads/default-profile-pic.png"
            }
            alt={friendData?.username}
          />
        </div>
        <div className="info-item">
          <span>{friendData?.username}</span>
          <div className="sightings-count">
            <span>{sightingsCount} Sightings</span>
          </div>
          <div className="rank">
            Rank:{" "}
            {sightingsCount < 1
              ? "Egg"
              : sightingsCount < 5
              ? "Larva"
              : sightingsCount < 30
              ? "Pupa"
              : "Lightning Bug"}
          </div>
        </div>
      </div>
      <button onClick={() => navigate("/profile")}>Return to Profile</button>
    </div>
  );
}

export default FriendProfile;
