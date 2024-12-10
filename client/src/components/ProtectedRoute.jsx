import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, getLoggedUser } from "../api/users";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/slice/loaderSlice";
import { setAllUsers, setUser } from "../redux/slice/usersSlice";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.userReducer);

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
        dispatch(setUser(response.data));
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

  const fetchAllUsers = async () => {
    let response = null;

    try {
      dispatch(showLoader()); // Show loader before making the request.

      // Fetch users from the API.
      response = await getAllUsers();

      // Hide loader after fetching data.
      dispatch(hideLoader());

      // Check API response.
      if (response.success) {
        // If successful, update state with user data.
        dispatch(setAllUsers(response.data));
      } else {
        // Handle API error response.
        toast.error(response.message || "Failed to fetch users.");

        // Redirect to login if authentication error.
        if (response.message?.toLowerCase().includes("Unauthorized")) {
          window.location.href = "/login";
        }
      }
    } catch (error) {
      // Ensure loader is hidden even in case of an error.
      dispatch(hideLoader());

      // Handle unexpected errors.
      console.error("Error fetching users:", error);

      toast.error(error.message || "An unexpected error occurred.");

      // Redirect to login if needed.
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getLoggedInUser();
      fetchAllUsers();
    } else {
      navigate("/login");
    }
  }, []);

  return <div>{children}</div>;
}
