import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatName } from "../../utils/name";
import moment from "moment";

export default function Profile() {
  const { user: currentUser } = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();

  const [image, setImage] = useState("");

  function getInitials() {
    let f = currentUser?.firstName
      ? currentUser.firstName.toUpperCase()[0]
      : "";
    let l = currentUser?.lastName ? currentUser.lastName.toUpperCase()[0] : "";
    return `${f}${l}` || "N/A";
  }

  return (
    <div className="profile-page-container">
      <div className="profile-pic-container">
        {currentUser?.profilePic && (
          <img
            src="quick-chat-app-background.jpg"
            alt="Profile Pic"
            className="user-profile-pic-upload"
          />
        )}
        {!currentUser?.profilePic && (
          <div className="user-default-profile-avatar">{getInitials()}</div>
        )}
      </div>

      <div className="profile-info-container">
        <div className="user-profile-name">
          <h1>{formatName(currentUser)}</h1>
        </div>
        <div>
          <b>Email: </b>
          {currentUser?.email}
        </div>
        <div>
          <b>Account Created: </b>
          {moment(currentUser?.createdAt).format("MMMM DD, YYYY")}
        </div>
        <div className="select-profile-pic-container">
          <input type="file" />
        </div>
      </div>
    </div>
  );
}
