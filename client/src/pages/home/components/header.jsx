import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Header({ socket }) {
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

  const logout = () => {
    try {
      // Remove token from local storage
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
      }

      // Notify server about the user going offline
      if (socket && user?._id) {
        socket.emit("user-offline", user._id, (ack) => {
          if (ack?.success) {
            console.log("User marked offline successfully");
          } else {
            console.error("Failed to mark user offline:", ack?.error);
          }
        });
      }

      // Navigate to login page
      if (navigate) {
        navigate("/login");
      } else {
        console.error("Navigation function is not defined.");
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <div className="app-header">
      <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
        Quik Realtime Chat
      </div>
      <div className="app-user-profile">
        {user?.profilePic && (
          <img
            src={user?.profilePic}
            alt="profile-pic"
            className="logged-user-profile-pic"
            onClick={() => navigate("/profile")}
          ></img>
        )}
        {!user?.profilePic && (
          <button
            className="logged-user-profile-pic"
            onClick={() => navigate("/profile")}
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate("/profile");
              }
            }}
          >
            {getInitials()}
          </button>
        )}
        <div className="logged-user-name">{getFullname()}</div>
        <button
          type="button"
          className="logout-button"
          onClick={logout}
          aria-label="Logout"
        >
          <i className="fa fa-power-off"></i>
          <span className="sr-only">Logout</span>
        </button>
      </div>
    </div>
  );
}
