import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_REACT_SERVER_BASE_URL ||
    "https://ressuman-real-time-chat-server-app.onrender.com", // Use env variable
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// export const axiosInstance = axios.create({
//   headers: {
//     authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });
