import { axiosInstance } from "./index";

export const createNewMessage = async (message) => {
  try {
    console.log("Sending message:", message); // Log the input message
    const response = await axiosInstance.post(
      `/api/v1/message/new-message`,
      message
    );
    console.log("Response data:", response.data); // Log the response data
    return response.data;
  } catch (error) {
    // Log the error details
    if (error.response) {
      // Server responded with a status other than 200-299
      console.error("Server error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error, no response received:", error.request);
    } else {
      // Something else caused the error
      console.error("Error message:", error.message);
    }
    return Promise.reject(error); // Optionally, reject the promise for upstream handling
  }
};

export const getAllMessages = async (chatId) => {
  try {
    console.log("Fetching messages for chat ID:", chatId); // Log the input chatId
    const response = await axiosInstance.get(
      `/api/v1/message/get-all-messages/${chatId}`
    );
    console.log("Response data:", response.data); // Log the response data
    return response.data;
  } catch (error) {
    // Log the error details for debugging
    if (error.response) {
      // Server responded with an error status
      console.error("Server error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error, no response received:", error.request);
    } else {
      // Something else happened
      console.error("Error message:", error.message);
    }
    return Promise.reject(error); // Reject promise for upstream handling
  }
};
