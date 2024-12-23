import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user } = useSelector((state) => state.userReducer);

  const navigate = useNavigate();

  // function getFullname() {
  //   let fname =
  //     user?.firstName.charAt(0).toUpperCase() +
  //     user?.firstName.slice(1).toLowerCase();

  //   let lname =
  //     user?.lastName.charAt(0).toUpperCase() +
  //     user?.lastName.slice(1).toLowerCase();

  //   return fname + " " + lname;
  // }
  function getFullname() {
    let fname = user?.firstName
      ? user.firstName.charAt(0).toUpperCase() +
        user.firstName.slice(1).toLowerCase()
      : "";

    let lname = user?.lastName
      ? user.lastName.charAt(0).toUpperCase() +
        user.lastName.slice(1).toLowerCase()
      : "";

    return `${fname} ${lname}`.trim();
  }

  function getInitials() {
    let f = user?.firstName ? user.firstName.toUpperCase()[0] : "";
    let l = user?.lastName ? user.lastName.toUpperCase()[0] : "";
    return `${f}${l}` || "N/A";
  }

  // function getInitials() {
  //   let f = user?.firstName.toUpperCase()[0];
  //   let l = user?.lastName.toUpperCase()[0];
  //   return f + l;
  // }

  return (
    <div className="app-header">
      <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
        Quik Realtime Chat
      </div>
      <div className="app-user-profile">
        {/* {user?.profilePic && (
          <img
            src={user?.profilePic}
            alt="profile-pic"
            className="logged-user-profile-pic"
            onClick={() => navigate("/profile")}
          ></img>
        )}
        {!user?.profilePic && (
          <div
            className="logged-user-profile-pic"
            onClick={() => navigate("/profile")}
          >
            {getInitials()}
          </div>
        )} */}
        <div className="logged-user-name">{getFullname()}</div>
        <div
          className="logged-user-profile-pic"
          onClick={() => navigate("/profile")}
        >
          {/* {getFullname()} */}
          {getInitials()}
        </div>
        {/* <button
          type="button"
          className="logout-button"
          //onClick={logout}
        >
          ghhg
          <i className="fa fa-power-off"></i>
        </button> */}
      </div>
    </div>
  );
}
