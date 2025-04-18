import axios from "axios";
import { axiosInstance } from "./index";

export const getLoggedUser = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/user/get-logged-user`);
    return response.data; // Return the successful response data
  } catch (error) {
    // Log the error details for debugging
    console.error("Error fetching logged user:", error);

    // Return a structured error object
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while fetching the logged user.",
    };
  }
};

export const getAllUsers = async () => {
  try {
    // Replace 'url' with the actual base URL or ensure it's properly defined.
    const response = await axiosInstance.get(`/api/v1/user/get-all-users`);
    return response.data; // Return data if successful.
  } catch (error) {
    // Log error details for debugging.
    console.error("Error fetching users:", error.message);

    // Check if the error is an AxiosError to extract response details.
    if (axios.isAxiosError(error)) {
      console.error("Axios Error Response:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to fetch users."
      );
    }

    // For non-Axios errors, rethrow a generic error.
    throw new Error("An unexpected error occurred.");
  }
};

export const uploadProfilePic = async (
  image
  //userId
) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/user/upload-profile-pic`,
      {
        image,
        //userId,
      }
    );

    if (response?.data?.success) {
      return response.data; // Return the success response
    } else {
      throw new Error(
        response?.data?.message || "Failed to upload profile picture."
      );
    }
  } catch (error) {
    console.error("Error uploading profile picture:", error.message);

    // Provide a consistent error format
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An error occurred while uploading the profile picture.",
    };
  }
};
