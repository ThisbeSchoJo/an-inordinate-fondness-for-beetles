import { useState } from "react";
import "../add-friend-form.css";

function AddFriendForm({
  setIsAddingFriend,
  handleAddFriend,
  friendSearchResults,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  //   const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // setIsSearching(true);
    fetch(`http://localhost:5555/friend-search?username=${searchTerm}`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to search for friends");
        }
        return response.json();
      })
      .then((data) => {
        setSearchResults(data);
        // setIsSearching(false);
      })
      .catch((error) => {
        console.error("Error searching for friends:", error);
        // setIsSearching(false);
      });
  };

  return (
    <>
      <div className="add-friend-form">
        <div className="form-content">
          <button
            className="close-button"
            onClick={() => setIsAddingFriend(false)}
          >
            ×
          </button>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              className="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username"
            />
            <button className="search-button" type="submit">
              Search
            </button>
          </form>
          <div className="search-results">
            {searchResults.map((user) => (
              <div key={user.id} className="search-result-item">
                <img
                  src={
                    user.profile_picture ||
                    "http://localhost:5555/static/uploads/default-profile-pic.png"
                  }
                  alt={user.username}
                />
                <span>{user.username}</span>
                <button
                  className="add-friend-button"
                  onClick={() => handleAddFriend(user.id)}
                >
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AddFriendForm;
