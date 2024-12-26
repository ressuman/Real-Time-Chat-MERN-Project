import { useSelector } from "react-redux";
import Chat from "./components/chat";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://localhost:4292");

export default function Home() {
  const { selectedChat, user: currentUser } = useSelector(
    (state) => state.userReducer
  );

  const [onlineUser, setOnlineUser] = useState([]);

  useEffect(() => {
    if (currentUser) {
      // Join the room and notify about user login
      socket.emit("join-room", currentUser._id);
      socket.emit("user-login", currentUser._id);

      // Listener for online users
      const handleOnlineUsers = (onlineUsers) => {
        setOnlineUser(onlineUsers);
      };

      socket.on("online-users", handleOnlineUsers);
      socket.on("online-users-updated", handleOnlineUsers);

      // Cleanup on component unmount or user change
      return () => {
        socket.off("online-users", handleOnlineUsers);
        socket.off("online-users-updated", handleOnlineUsers);
      };
    }
  }, [currentUser]);

  return (
    <div className="home-page">
      <Header socket={socket} />
      <div className="main-content">
        {/* <!--SIDEBAR LAYOUT--> */}
        <Sidebar socket={socket} onlineUser={onlineUser} />
        {/* <!--CHAT AREA LAYOUT--> */}
        {selectedChat && <Chat socket={socket} />}
      </div>
    </div>
  );
}
