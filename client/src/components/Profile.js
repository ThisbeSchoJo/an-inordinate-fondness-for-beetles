/**
 * Profile Component
 * Displays user profile information and manages friend relationships
 * Features:
 * - Profile picture display with fallback to default image
 * - Username display
 * - Friend list management (add/remove friends)
 * - Profile editing capability (button present but functionality not implemented)
 */

import "../profile.css";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AddFriendForm from "./AddFriendForm";
import FriendProfile from "./FriendProfile";

function Profile() {
  // Get user data from context
  const { user } = useOutletContext();

  // State for managing friend-related functionality
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [friendSearchResults, setFriendSearchResults] = useState([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);
  const [isRemovingFriend, setIsRemovingFriend] = useState(false);
  const [friends, setFriends] = useState([]);
  const [sightingsCount, setSightingsCount] = useState(0);
  const navigate = useNavigate();

  // Fetch user's friends list and sightings count on component mount
  useEffect(() => {
    // Fetch friends
    fetch(`http://localhost:5555/friends`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch friends");
        }
        return response.json();
      })
      .then((data) => {
        setFriends(data);
        setIsLoadingFriends(false);
      })
      .catch((error) => {
        console.error("Error fetching friends:", error);
        setFriends([]); // Set friends to empty array on error
        setIsLoadingFriends(false);
      });

    // Fetch sightings count
    fetch(`http://localhost:5555/sightings/count`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch sightings count");
        }
        return response.json();
      })
      .then((data) => {
        setSightingsCount(data.count);
      })
      .catch((error) => {
        console.error("Error fetching sightings count:", error);
        setSightingsCount(0);
      });
  }, []);

  /**
   * Removes a friend from the user's friend list
   * Makes DELETE request to remove friend relationship
   * Updates local friends state to reflect removal
   */
  const handleRemoveFriend = (friendId) => {
    setIsRemovingFriend(true);
    fetch(`http://localhost:5555/friends/${friendId}`, {
      method: "DELETE",
      credentials: "include",
    });
    // use the setFriends function to update the friends state
    setFriends(friends.filter((friend) => friend.id !== friendId));
    setIsRemovingFriend(false);
  };

  /**
   * Adds a new friend to the user's friend list
   * Makes POST request to create friend relationship
   * Updates local friends state with new friend
   * Handles both direct addition and refresh from server
   */
  const handleAddFriend = (friendId) => {
    fetch(`http://localhost:5555/add-friend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ friend_id: friendId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add friend");
        }
        if (response.ok) {
          const addedFriend = friendSearchResults.find(
            (f) => f.id === friendId
          );
          if (addedFriend) {
            setFriends([...friends, addedFriend]);
          } else {
            // If friend not found in search results, refresh entire friends list
            fetch(`http://localhost:5555/friends`, {
              credentials: "include",
            })
              .then((response) => response.json())
              .then(setFriends);
          }
          setIsAddingFriend(false);
        }
      })
      .catch((error) => {
        console.error("Error adding friend:", error);
        setIsAddingFriend(false);
      });
  };

  const handleViewProfile = (friendId) => {
    navigate(`/profile/${friendId}`);
  };
  return (
    <>
      {/* Main profile section */}
      <div className="profile-container">
        <div className="profile-header">{/* <h1>Profile</h1> */}</div>
        <div className="profile-info">
          {/* Profile picture with fallback to default image */}
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
          {/* Username display */}
          <div className="info-item">
            <span>{user?.username || "Not logged in"}</span>
            <div className="sightings-count">
              <span>{sightingsCount} Sightings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Friends list section */}
      <div className="friends-container">
        <h2>Friends</h2>
        <div className="friends-list">
          {/* Map through friends array to display each friend */}
          {friends.map((friend) => (
            <div key={friend.id} className="friend-item">
              {/* Friend's profile picture with fallback */}
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
                onClick={() => handleViewProfile(friend.id)}
                className="friend-button"
              >
                View Profile
              </button>
              {/* Unfriend button */}
              <button
                onClick={() => handleRemoveFriend(friend.id)}
                className="friend-button"
              >
                Unfriend
              </button>
            </div>
          ))}
          {/* Profile action buttons */}
          <div className="profile-actions">
            {/* Add any profile actions here */}
            <button
              onClick={() => setIsAddingFriend(true)}
              className="add-friend-button"
            >
              Add Friend
            </button>
          </div>
        </div>
      </div>

      {/* Conditional rendering of AddFriendForm */}
      {isAddingFriend && (
        <AddFriendForm
          setIsAddingFriend={setIsAddingFriend}
          friendSearchResults={friendSearchResults}
          handleAddFriend={handleAddFriend}
          handleRemoveFriend={handleRemoveFriend}
          friends={friends}
        />
      )}
    </>
  );
}

export default Profile;
