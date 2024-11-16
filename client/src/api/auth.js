import { axiosInstance } from "./index";

//const url = "https://quick-chat-server-8t9c.onrender.com";

// Sign up a new user
export const signupUser = async (user) => {
  try {
    // const response = await axiosInstance.post(
    //   `${url}/api/v1/auth/signup`,
    //   user
    // );
    const response = await axiosInstance.post(`/api/v1/auth/signup`, user);
    return response.data; // Return data on success
  } catch (error) {
    console.error("Signup error:", {
      message: error.message,
      response: error.response?.data, // Response from the server
      status: error.response?.status, // HTTP status code
    });
    console.log("Error details:", {
      message: error.message,
      response: error.response,
      request: error.request,
    });

    throw new Error(error.response?.data?.message || "Signup failed"); // Throw readable error
  }
};

// Log in a user
// export const loginUser = async (user) => {
//   try {
//     const response = await axiosInstance.post(`${url}/api/v1/auth/login`, user);

//     // Save token to localStorage if login is successful
//     if (response.data?.token) {
//       localStorage.setItem("token", response.data.token);
//     }

//     return response.data; // Return data on success
//   } catch (error) {
//     console.error("Login error:", {
//       message: error.message,
//       response: error.response?.data, // Response from the server
//       status: error.response?.status, // HTTP status code
//     });
//     console.log("Error details:", {
//       message: error.message,
//       response: error.response,
//       request: error.request,
//     });

//     throw new Error(error.response?.data?.message || "Login failed"); // Throw readable error
//   }
// };
