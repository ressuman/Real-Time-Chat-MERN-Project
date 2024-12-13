import { useSelector } from "react-redux";

export default function Chat() {
  const { selectedChat } = useSelector((state) => state.userReducer);

  return (
    <div>
      <h1>Chat Page</h1>
      {selectedChat && <h2>{selectedChat._id}</h2>}
    </div>
  );
}
