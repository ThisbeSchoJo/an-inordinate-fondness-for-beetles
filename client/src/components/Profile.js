import "../profile.css";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import AddFriendForm from "./AddFriendForm";

function Profile() {
  const { user } = useOutletContext();
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [friendSearchResults, setFriendSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5555/friends`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setFriends(data);
      });
  }, []);

  const handleRemoveFriend = (friendId) => {
    fetch(`http://localhost:5555/friends/${friendId}`, {
      method: "DELETE",
      credentials: "include",
    });
    // use the setFriends function to update the friends state
    setFriends(friends.filter((friend) => friend.id !== friendId));
  };

  const handleAddFriend = (friendId) => {
    fetch(`http://localhost:5555/add-friend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ friend_id: friendId }),
    }).then((response) => {
      if (response.ok) {
        const addedFriend = friendSearchResults.find(f => f.id === friendId);
        if (addedFriend) {
          setFriends([...friends, addedFriend]);
        } else {
          fetch(`http://localhost:5555/friends`, {
            credentials: "include",
          })
            .then((response) => response.json())
            .then(setFriends);
        }
        setIsAddingFriend(false);
      }
    });
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-header">{/* <h1>Profile</h1> */}</div>
        <div className="profile-info">
          <div className="profile-picture">
            <img
              src={
                user
                  ? `http://localhost:5555${user.profile_picture}`
                  : "http://localhost:5555/static/uploads/default-profile-pic.png"
              }
              alt="Profile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "http://localhost:5555/static/uploads/default-profile-pic.png";
              }}
            />
          </div>
          <div className="info-item">
            <span>{user?.username || "Not logged in"}</span>
          </div>
        </div>
        <div className="profile-actions">
          {/* Add any profile actions here */}
          <button className="profile-button">Edit Profile</button>
          <button
            onClick={() => setIsAddingFriend(true)}
            className="profile-button"
          >
            Add Friend
          </button>
        </div>
      </div>
      <div className="friends-container">
        <h2>Friends</h2>
        <div className="friends-list">
          {friends.map((friend) => (
            <div key={friend.id} className="friend-item">
              <img
                src={
                  friend.profile_picture
                    ? `http://localhost:5555${friend.profile_picture}`
                    : "http://localhost:5555/static/uploads/default-profile-pic.png"
                }
                alt={friend.username}
              />
              <h4>{friend.username}</h4>
              <button
                onClick={() => handleRemoveFriend(friend.id)}
                className="friend-button"
              >
                Unfriend
              </button>
            </div>
          ))}
        </div>
      </div>
      {isAddingFriend && (
        <AddFriendForm
          setIsAddingFriend={setIsAddingFriend}
          friendSearchResults={friendSearchResults}
          handleAddFriend={handleAddFriend}
          friends={friends}
        />
      )}
    </>
  );
}

export default Profile;
