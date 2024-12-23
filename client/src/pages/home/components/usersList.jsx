import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../redux/slice/loaderSlice";
import { createNewChat } from "../../../api/chat";
import toast from "react-hot-toast";
import { setAllChats, setSelectedChat } from "../../../redux/slice/usersSlice";
import moment from "moment";
import { formatName } from "../../../utils/name";
import store from "../../../redux/store/store";
import { useEffect } from "react";

export default function UsersList({ searchKey, socket, onlineUser }) {
  const {
    allUsers,
    allChats,
    user: currentUser,
    selectedChat,
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

  const isSelectedChat = (user) => {
    if (!user || !selectedChat) {
      return false; // If either `user` or `selectedChat` is not available, return false
    }

    // Ensure `selectedChat.members` exists and is an array
    if (Array.isArray(selectedChat.members)) {
      return selectedChat.members.some((member) => member._id === user._id);
    }

    return false; // Default return if `members` is not an array
  };

  const getLastMessageTimeStamp = (userId) => {
    const chat = allChats?.find((chat) =>
      chat.members.some((member) => member._id === userId)
    );

    if (!chat || !chat?.lastMessage) {
      return ""; // Return empty string if no chat or last message exists
    }

    return moment(chat?.lastMessage?.createdAt).format("hh:mm A");
  };

  const getLastMessage = (userId) => {
    const chat = allChats?.find((chat) =>
      chat.members.some((member) => member._id === userId)
    );

    if (!chat || !chat?.lastMessage) {
      return ""; // Return empty string if no chat or last message exists
    }

    const isSenderCurrentUser = chat?.lastMessage?.sender === currentUser._id;
    const msgPrefix = isSenderCurrentUser ? "You: " : "";
    const messageText = chat?.lastMessage?.text || "[Media]"; // Fallback for non-text messages
    return msgPrefix + messageText.substring(0, 25); // Limit to 25 characters
  };

  const getUnreadMessageCount = (userId) => {
    const chat = allChats?.find((chat) =>
      chat.members.some((member) => member._id === userId)
    );

    if (
      chat &&
      chat.unreadMessageCount > 0 &&
      chat.lastMessage?.sender !== currentUser._id
    ) {
      return (
        <div className="unread-message-counter">{chat.unreadMessageCount}</div>
      );
    }

    return null; // Use null for better React rendering logic
  };

  useEffect(() => {
    const handleSetMessageCount = (message) => {
      const state = store.getState();
      const selectedChat = state.userReducer.selectedChat;
      let allChats = [...state.userReducer.allChats]; // Make a copy to avoid mutating state directly

      if (selectedChat?._id !== message.chatId) {
        // Update unread message count and lastMessage for the relevant chat
        allChats = allChats.map((chat) =>
          chat._id === message.chatId
            ? {
                ...chat,
                unreadMessageCount: (chat?.unreadMessageCount || 0) + 1,
                lastMessage: message,
              }
            : chat
        );
      }

      // Reorganize chats: bring the latest chat to the top
      const latestChat = allChats.find((chat) => chat._id === message.chatId);
      if (latestChat) {
        const otherChats = allChats.filter(
          (chat) => chat._id !== message.chatId
        );
        allChats = [latestChat, ...otherChats];
      }

      dispatch(setAllChats(allChats)); // Update Redux state
    };

    //socket.on("set-message-count", handleSetMessageCount);
    socket.on("receive-message", handleSetMessageCount);
    // Cleanup the listener on component unmount
    return () => {
      //socket.off("set-message-count", handleSetMessageCount);
      socket.off("receive-message", handleSetMessageCount);
    };
  }, [dispatch]);

  const filteredUsers = searchKey.trim()
    ? allUsers.filter((user) => {
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

  return filteredUsers.map((user) => {
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
        <div
          className={isSelectedChat(user) ? "selected-user" : "filtered-user"}
        >
          <div className="filter-user-display">
            {user.profilePic && (
              <img
                src={user.profilePic}
                alt="Profile Pic"
                className="user-profile-image"
                style={
                  onlineUser.includes(user._id)
                    ? { border: "#82e0aa 3px solid" }
                    : {}
                }
              />
            )}
            {!user.profilePic && (
              <div
                className={
                  isSelectedChat(user)
                    ? "user-selected-avatar"
                    : "user-default-avatar"
                }
                style={
                  onlineUser.includes(user._id)
                    ? { border: "#82e0aa 3px solid" }
                    : {}
                }
              >
                {user.firstName.charAt(0).toUpperCase() +
                  user.lastName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="filter-user-details">
              <div className="user-display-name">{formatName(user)}</div>
              <div className="user-display-email">
                {getLastMessage(user._id) || user.email}
              </div>
            </div>

            <div>
              {getUnreadMessageCount(user._id)}
              <div className="last-message-timestamp">
                {getLastMessageTimeStamp(user._id)}
              </div>
            </div>

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
  });
}
