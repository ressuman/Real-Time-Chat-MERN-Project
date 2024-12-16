import { axiosInstance } from "./index";

// Get all chats
export const getAllChats = async () => {
  try {
    const response = await axiosInstance.get("api/v1/chat/get-all-chats");
    return response.data; // Adjust response structure if needed
  } catch (error) {
    handleApiError(error);
  }
};

// Create a new chat
export const createNewChat = async (members) => {
  try {
    const response = await axiosInstance.post("api/v1/chat/create-new-chat", {
      members,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Clear unread message count
export const clearUnreadMessageCount = async (chatId) => {
  try {
    const response = await axiosInstance.post(
      "api/v1/chat/clear-unread-message",
      {
        chatId,
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Centralized error handler
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with a status outside 2xx range
    console.error("API Error:", error.response.data);
    throw new Error(error.response.data.message || "An error occurred.");
  } else if (error.request) {
    // No response received
    console.error("Network Error:", error.request);
    throw new Error("Network error. Please try again.");
  } else {
    // Other errors
    console.error("Error:", error.message);
    throw new Error("An unexpected error occurred.");
  }
};
