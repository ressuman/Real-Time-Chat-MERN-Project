import { useDispatch, useSelector } from "react-redux";
//import { toCamelCase } from "../../../utils/camelCase";
import toast from "react-hot-toast";
import { createNewMessage, getAllMessages } from "../../../api/message";
import { hideLoader, showLoader } from "../../../redux/slice/loaderSlice";
import { useEffect, useState } from "react";
import moment from "moment";
import { formatName } from "../../../utils/name";
import { clearUnreadMessageCount } from "../../../api/chat";

export default function Chat() {
  const {
    selectedChat,
    user: currentUser,
    allChats,
  } = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  // Correctly find the other user in the chat
  const selectedUser = selectedChat
    ? selectedChat.members.find((user) => user._id !== currentUser._id)
    : null;

  const sendMessage = async () => {
    if (!selectedChat || !currentUser || !currentUser._id) {
      toast.error("Unable to send the message. Please try again later.");
      return;
    }

    // if (!message.trim() && !image) {
    //   toast.error("Cannot send an empty message.");
    //   return;
    // }

    try {
      const newMessage = {
        chatId: selectedChat._id,
        sender: currentUser._id,
        text: message.trim(),
        //image: image || null, // Set image to null if not provided
      };

      // Emit message through socket
      // socket.emit("send-message", {
      //   ...newMessage,
      //   members: selectedChat.members.map((m) => m._id),
      //   read: false,
      //   createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      // });

      dispatch(showLoader());
      // Save the message to the database
      const response = await createNewMessage(newMessage);
      dispatch(hideLoader());
      if (response.success) {
        setMessage(""); // Clear the input field
        //setShowEmojiPicker(false); // Close the emoji picker
        toast.success("Message sent successfully!");
      } else {
        toast.error(response.message || "Failed to send the message.");
      }
    } catch (error) {
      dispatch(hideLoader());
      console.error("Error sending message:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const fetchAllMessages = async () => {
    if (!selectedChat || !selectedChat._id) {
      toast.error("Unable to fetch messages. Please select a chat.");
      return;
    }

    try {
      dispatch(showLoader());

      const response = await getAllMessages(selectedChat._id);

      dispatch(hideLoader());

      if (response.success) {
        setAllMessages(response.data); // Populate the messages state
        toast.success("Messages loaded successfully.");
      } else {
        toast.error(response.message || "Failed to load messages.");
      }
    } catch (error) {
      dispatch(hideLoader());
      console.error("Error fetching messages:", error);
      toast.error(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    }
  };

  const clearUnreadMessages = async () => {
    try {
      // Emit socket event to clear unread messages
      // socket.emit("clear-unread-messages", {
      //   chatId: selectedChat._id,
      //   members: selectedChat.members.map((m) => m._id),
      // });

      // API call to clear unread message count
      dispatch(showLoader());
      const response = await clearUnreadMessageCount(selectedChat._id);
      dispatch(hideLoader());

      if (response.success) {
        // Update the allChats state with the new chat data
        const updatedChats = allChats.map((chat) =>
          chat._id === selectedChat._id ? { ...chat, ...response.data } : chat
        );

        //dispatch(setAllChats(updatedChats)); // Dispatch updated chats to the store
      }
    } catch (error) {
      // Display error message if something goes wrong
      dispatch(hideLoader());
      toast.error(error.message || "Failed to clear unread messages.");
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) {
      return "Invalid date"; // Handle cases where timestamp is undefined or null
    }

    const now = moment();
    const givenTime = moment(timestamp);

    if (!givenTime.isValid()) {
      return "Invalid date"; // Handle invalid timestamp formats
    }

    const diff = now.diff(givenTime, "days");

    if (diff < 1) {
      return `Today, ${givenTime.format("hh:mm A")}`;
    } else if (diff === 1) {
      return `Yesterday, ${givenTime.format("hh:mm A")}`;
    } else {
      return givenTime.format("MMM D, hh:mm A");
    }
  };

  useEffect(() => {
    const initializeChat = async () => {
      if (selectedChat) {
        await fetchAllMessages(); // Ensure messages are fetched
        if (selectedChat?.lastMessage?.sender !== currentUser._id) {
          await clearUnreadMessages(); // Clear unread messages if applicable
        }
      }
    };

    initializeChat();
  }, [selectedChat]);

  return (
    <>
      {selectedChat && selectedUser && (
        <div className="app-chat-area">
          {/* <!--RECEIVER DATA--> */}
          <div className="app-chat-area-header">
            {/* Display the receiver's name */}
            {/* {`${toCamelCase(selectedUser.firstName)} ${toCamelCase(
              selectedUser.lastName
            )}`} */}
            {formatName(selectedUser)}
          </div>

          {/* <!--Chat Area--> */}
          <div className="main-chat-area">
            {allMessages.map((message) => {
              const isCurrentUserSender = message.sender === currentUser._id;

              return (
                <div
                  key={message._id}
                  className="message-container"
                  style={
                    isCurrentUserSender
                      ? { justifyContent: "end" }
                      : { justifyContent: "start" }
                  }
                >
                  <div className="message">
                    <div
                      className={
                        isCurrentUserSender
                          ? "send-message"
                          : "received-message"
                      }
                    >
                      {message.text}
                    </div>
                    <div
                      className="message-timestamp"
                      style={
                        isCurrentUserSender
                          ? { float: "right" }
                          : { float: "left" }
                      }
                    >
                      {formatTime(message.createdAt)}{" "}
                      {isCurrentUserSender && message.read && (
                        <i
                          className="fa fa-check-circle"
                          aria-hidden="true"
                          style={{ color: "#e74c3c" }}
                        ></i>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* <!--SEND MESSAGE--> */}
          <div className="send-message-div">
            <input
              type="text"
              className="send-message-input"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="fa fa-paper-plane send-message-btn"
              aria-hidden="true"
              onClick={sendMessage}
            ></button>
          </div>
        </div>
      )}
    </>
  );
}
