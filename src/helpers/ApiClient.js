import axios from "axios";
import { API } from "../config/config";
import { clearUserDetailsInLocalStorage } from "./UserDetails";

const ApiClient = axios.create({
  baseURL: API,
});

ApiClient.interceptors.request.use(
  (config) => {
    // Attempt to get token from localStorage if your app uses JWT tokens
    const session = localStorage.getItem("session_user");
    if (session) {
      try {
        const user = JSON.parse(session);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        // ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

ApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const msg = error.response.data?.message;
      if (msg && msg.toLowerCase().includes("invalid token")) {
        clearUserDetailsInLocalStorage();
        localStorage.removeItem("session_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default ApiClient;
