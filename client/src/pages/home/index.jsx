import { useSelector } from "react-redux";
import Chat from "./components/chat";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import { io } from "socket.io-client";

export default function Home() {
  const { selectedChat } = useSelector((state) => state.userReducer);

  const socket = io("http://localhost:4292", {
    auth: {
      token: localStorage.getItem("token"),
    },
  });

  return (
    <div className="home-page">
      <Header />
      <div className="main-content">
        {/* <!--SIDEBAR LAYOUT--> */}
        <Sidebar />
        {/* <!--CHAT AREA LAYOUT--> */}
        {selectedChat && <Chat />}
      </div>
    </div>
  );
}
