import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../api/auth";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/slice/loaderSlice";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  async function onFormSubmit(event) {
    event.preventDefault();
    let response = null;

    // Validation: Check for empty fields
    // if (!user.firstName || !user.lastName || !user.email || !user.password) {
    //   //toast.error("Please fill in all fields.");
    //   alert("Please fill in all fields.");
    //   return;
    // }

    // Validation: Check for valid email format
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(user.email)) {
    //   //toast.error("Please enter a valid email address.");
    //   alert("Please enter a valid email address.");
    //   return;
    // }

    try {
      dispatch(showLoader());
      response = await signupUser(user);

      if (response?.success) {
        toast.success(response.message);
        setTimeout(() => {
          dispatch(hideLoader());
          navigate("/login");
        }, 1000);
      } else {
        toast.error(response?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      // Handle unexpected errors
      toast.error(
        err.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      dispatch(hideLoader()); // Ensure the loader is always hidden
    }
  }

  return (
    <div className="container">
      <div className="container-back-img"></div>
      <div className="container-back-color"></div>
      <div className="card">
        <div className="card_title">
          <h1>Create Account</h1>
        </div>
        <div className="form">
          <form onSubmit={onFormSubmit}>
            <div className="column">
              <input
                type="text"
                placeholder="First Name"
                value={user.firstName}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              />
            </div>
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
            <button>Sign Up</button>
          </form>
        </div>
        <div className="card_terms">
          <span>
            Already have an account?{""}
            <Link to="/login">Login Here</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
