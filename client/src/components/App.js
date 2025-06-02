import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import "../App.css";

function App() {
  // Authentication state
  // user will be null when no user is logged in
  // user will contain user data (id, username, etc.) when logged in
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:5555/check_session", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Session check failed");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Session check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Function to update the authentication state
  // Called after successful login/signup to store user data
  // Called after logout to clear user data (set to null)
  const updateUser = (userData) => {
    setUser(userData);
  };

  const handleAddFriend = (friendId) => {
    fetch(`http://localhost:5555/add-friend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ friend_id: friendId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFriends([...friends, data]);
        setIsFriend(true);
      });
  };

  const handleRemoveFriend = (friendId) => {
    fetch(`http://localhost:5555/friends/${friendId}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() => {
      setFriends(friends.filter((friend) => friend.id !== friendId));
      setIsFriend(false);
    });
  };

  return (
    <div className="App">
      <NavBar user={user} updateUser={updateUser} />
      <main className="main-container">
        <Outlet
          context={{
            user,
            updateUser,
            isLoading,
            friends,
            handleAddFriend,
            handleRemoveFriend,
            isFriend,
            setIsFriend,
          }}
        />
      </main>
    </div>
  );
}

export default App;
