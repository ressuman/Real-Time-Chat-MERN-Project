import { axiosInstance } from "./index";

export const getLoggedUser = async () => {
  try {
    const response = await axiosInstance.get(`api/v1/user/get-logged-user`);
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
