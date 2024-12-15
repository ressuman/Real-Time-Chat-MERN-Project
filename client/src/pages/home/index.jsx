import { useSelector } from "react-redux";
import Chat from "./components/chat";
import Header from "./components/header";
import Sidebar from "./components/sidebar";

export default function Home() {
  const { selectedChat } = useSelector((state) => state.userReducer);

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
