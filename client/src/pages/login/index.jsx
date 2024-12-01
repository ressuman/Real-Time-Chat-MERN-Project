import React from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/slice/loaderSlice";

export default function Login() {
  const dispatch = useDispatch();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  async function onFormSubmit(event) {
    event.preventDefault();

    let response = null;
    try {
      dispatch(showLoader());
      response = await loginUser(user);
      dispatch(hideLoader());

      if (response.success) {
        toast.success(response.message);
        localStorage.setItem("token", response.token);
        dispatch(showLoader());
        setTimeout(() => {
          dispatch(hideLoader());
          window.location.href = "/";
        }, 2000);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(response.message);
      console.log("Error details:", {
        message: error.message,
        response: error.response,
        request: error.request,
      });
    }
  }

  return (
    <div className="container">
      <div className="container-back-img"></div>
      <div className="container-back-color"></div>
      <div className="card">
        <div className="card_title">
          <h1>Login Here</h1>
        </div>
        <div className="form">
          <form onSubmit={onFormSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <button>Login</button>
          </form>
        </div>
        <div className="card_terms">
          <span>
            Don&apos;t have an account yet?
            <Link to="/signup">Signup Here</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
