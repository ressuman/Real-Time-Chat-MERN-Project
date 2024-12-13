import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../redux/slice/loaderSlice";
import { createNewChat } from "../../../api/chat";
import toast from "react-hot-toast";
import { setAllChats, setSelectedChat } from "../../../redux/slice/usersSlice";

export default function UsersList({ searchKey }) {
  const {
    allUsers,
    allChats,
    user: currentUser,
  } = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();

  const startNewChat = async (searchedUserId) => {
    try {
      dispatch(showLoader());

      // API call to create a new chat
      const response = await createNewChat([currentUser._id, searchedUserId]);

      dispatch(hideLoader());

      if (response && response.success) {
        toast.success(response.message || "Chat started successfully.");

        // Add the new chat to the current list of chats
        const newChat = response.data;
        const updatedChats = [...allChats, newChat];

        dispatch(setAllChats(updatedChats));
        dispatch(setSelectedChat(newChat)); // Optionally select the new chat
      } else {
        // Handle failure in API response
        toast.error(response.message || "Failed to start a new chat.");
      }
    } catch (error) {
      dispatch(hideLoader());

      // Handle unexpected errors
      console.error("Error starting new chat:", error);

      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred.";
      toast.error(errorMessage);
    }
  };

  const openChat = (selectedUserId) => {
    if (!selectedUserId || !currentUser?._id) {
      console.error("Invalid user IDs provided.");
      return;
    }

    // Find an existing chat between the current user and the selected user
    const chat = allChats.find(
      (chat) =>
        chat.members.some((member) => member._id === currentUser._id) &&
        chat.members.some((member) => member._id === selectedUserId)
    );

    if (chat) {
      // Dispatch action to set the selected chat
      dispatch(setSelectedChat(chat));
    } else {
      console.warn("No existing chat found with the selected user.");
    }
  };

  const filteredUsers = searchKey.trim()
    ? // ? allUsers.filter((user) => {
      //     // Check if the search key matches either firstName or lastName
      //     return (
      //       user.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
      //       user.lastName.toLowerCase().includes(searchKey.toLowerCase())
      //     );
      //   })
      // : allChats
      //     .filter((chat) =>
      //       chat.members.some((member) => member._id === currentUser._id)
      //     )
      //     .map((chat) =>
      //       chat.members.find((member) => member._id !== currentUser._id)
      //     );
      allUsers.filter((user) => {
        // Check if the search key matches either firstName or lastName
        return (
          user.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchKey.toLowerCase())
        );
      })
    : allChats
        .filter((chat) =>
          chat.members.some((member) => member._id === currentUser._id)
        )
        .map((chat) => {
          const otherMember = chat.members.find(
            (member) => member._id !== currentUser._id
          );
          // Enrich the other member with details from allUsers
          return (
            allUsers.find((user) => user._id === otherMember._id) || otherMember
          );
        });

  return (
    // allUsers.filter((user) => {
    //   // Check if the search key matches either firstName or lastName
    //   const matchesSearchKey =
    //     user.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
    //     user.lastName.toLowerCase().includes(searchKey.toLowerCase());

    //   return matchesSearchKey;
    // }) ||
    // allChats
    //   .some((chat) => chat.members.includes(user._id))
    // .filter((user) => {
    //   // Filter users by search key or if a chat already exists
    //   return (
    //     ((user.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
    //       user.lastName.toLowerCase().includes(searchKey.toLowerCase())) &&
    //       searchKey) ||
    //     allChats.some((chat) =>
    //       chat.members.some((member) => member._id === user._id)
    //     )
    //   );
    // })
    filteredUsers.map((user) => {
      // Check if a chat already exists between the current user and this user
      const chatExists = allChats.some(
        (chat) =>
          chat.members.some((member) => member._id === currentUser._id) &&
          chat.members.some((member) => member._id === user._id)
      );
      return (
        <div
          key={user._id}
          className="user-search-filter"
          onClick={() => openChat(user._id)}
        >
          <div className="filtered-user">
            <div className="filter-user-display">
              {user.profilePic && (
                <img
                  src={user.profilePic}
                  alt="Profile Pic"
                  className="user-profile-image"
                />
              )}
              {!user.profilePic && (
                <div className="user-default-profile-pic">
                  {user.firstName.charAt(0).toUpperCase() +
                    user.lastName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="filter-user-details">
                <div className="user-display-name">
                  {user.firstName + " " + user.lastName}
                </div>
                <div className="user-display-email">{user.email}</div>
              </div>

              {/* {!allChats.find((chat) => chat.members.includes(user._id)) && (
                <div className="user-start-chat">
                  <button className="user-start-chat-btn">Start Chat</button>
                </div>
              )} */}

              {/* Show Start Chat button only if chat does not exist */}
              {!chatExists && (
                <div className="user-start-chat">
                  <button
                    type="button"
                    className="user-start-chat-btn"
                    onClick={() => startNewChat(user._id)}
                  >
                    Start Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    })
  );
}
