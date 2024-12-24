import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatName } from "../../utils/name";
import moment from "moment";
import toast from "react-hot-toast";
import { uploadProfilePic } from "../../api/users";
import { hideLoader, showLoader } from "../../redux/slice/loaderSlice";
import { setUser } from "../../redux/slice/usersSlice";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user: currentUser } = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [image, setImage] = useState("");

  useEffect(() => {
    if (currentUser && currentUser.profilePic) {
      setImage(currentUser.profilePic);
    } else {
      setImage(null); // Optional: Clear image state if no profilePic
    }
  }, [currentUser]);

  function getInitials() {
    let f = currentUser?.firstName
      ? currentUser.firstName.toUpperCase()[0]
      : "";
    let l = currentUser?.lastName ? currentUser.lastName.toUpperCase()[0] : "";
    return `${f}${l}` || "N/A";
  }

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
  const SUPPORTED_FILE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];
  const onFileSelect = async (e) => {
    const file = e.target.files[0];

    if (!file) return; // Ensure a file is selected

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds the 3MB limit!");
      return;
    }

    // Validate file type
    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      toast.error("Unsupported file type! Please upload a valid image.");
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImage(reader.result); // Update the state with the base64 image
      // Optionally, dispatch an action or make an API call to save the image
      toast.success("Profile picture updated successfully!");
    };

    reader.onerror = () => {
      console.error("Error reading the file"); // Log any errors during reading
      toast.error("Error reading the file. Please try again.");
    };
  };

  const updateProfilePic = async () => {
    // Check if an image is selected before proceeding
    if (!image) {
      toast.error("Please select an image to upload.");
      return;
    }

    try {
      dispatch(showLoader()); // Show loader to indicate uploading is in progress

      // Call the API function to upload the profile pic
      const response = await uploadProfilePic(image);

      dispatch(hideLoader()); // Hide loader after the upload attempt

      if (response.success) {
        toast.success(
          response.message || "Profile picture uploaded successfully!"
        );
        dispatch(setUser(response.data)); // Update the user state with the new profile data
      } else {
        toast.error(response.message || "Failed to upload profile picture.");
      }
    } catch (err) {
      // Log the error and show a user-friendly message
      console.error("Profile picture upload failed:", err);
      toast.error(
        err.message || "An error occurred while uploading the profile picture."
      );
      dispatch(hideLoader()); // Hide loader on error
    }
  };

  return (
    <div>
      <div className="back-button-container">
        {/* Back Button */}
        <button
          className="back-button"
          onClick={() => navigate("/")} // Navigate to the homepage
        >
          ← Back to Home
        </button>
      </div>
      <div className="profile-page-container">
        <div className="profile-pic-container">
          {image && (
            <img
              src={image}
              alt="Profile Pic"
              className="user-profile-pic-upload"
            />
          )}
          {!image && (
            <div className="user-default-profile-avatar">{getInitials()}</div>
          )}
        </div>

        <div className="profile-info-container">
          <div className="user-profile-name">
            <h1>{formatName(currentUser) || "User"}</h1>
          </div>

          <div>
            <b>Email: </b>
            {currentUser?.email || "Not Available"}
          </div>

          <div>
            <b>Account Created: </b>
            {moment(currentUser?.createdAt).format("MMMM DD, YYYY")}
          </div>

          <div className="select-profile-pic-container">
            <input type="file" onChange={onFileSelect} />
            <button className="upload-image-btn" onClick={updateProfilePic}>
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
