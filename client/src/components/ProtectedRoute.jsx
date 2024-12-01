import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../api/users";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../redux/slice/loaderSlice";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [user, setUser] = useState(null);

  const getLoggedInUser = async () => {
    try {
      // Show loader before starting the API call
      dispatch(showLoader());

      // Make the API call
      const response = await getLoggedUser();

      // Hide loader after the API call
      dispatch(hideLoader());

      if (response.success) {
        // Dispatch the user data to the Redux store
        //dispatch(setUser(response.data));
        setUser(response.data);
      } else {
        // Show error toast and redirect to login
        toast.error(
          response.message || "Session expired. Please log in again."
        );
        navigate("/login"); // Use `navigate` for better React Router navigation
      }
    } catch (error) {
      // Ensure loader is hidden in case of error
      dispatch(hideLoader());

      // Log error details for debugging
      console.error("Error during user login fetch:", error);

      // Optionally show an error toast
      toast.error(
        "An error occurred while fetching the user. Please try again."
      );

      // Redirect to login
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getLoggedInUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <p>Name: {user?.firstName + " " + user?.lastName}</p>
      <p>Email: {user?.email}</p>
      <br />
      {children}
    </div>
  );
}
