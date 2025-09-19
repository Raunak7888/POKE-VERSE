import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/hooks/useAuthStore";
import { BACKEND_URL } from "@/components/utils/backendUrl";

const api = axios.create({
  baseURL: BACKEND_URL, // Corrected: Directly use the variable
  withCredentials: true,
});
// Attach accessToken on each request
api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Optional: handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${BACKEND_URL}/api/auth/refresh`,
            { refreshToken },
            { withCredentials: true }
          );
          const { accessToken, user } = res.data;

          // update store
          useAuthStore.getState().setAuth(user, accessToken, refreshToken);

          // retry original request
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api.request(error.config);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          useAuthStore.getState().clearAuth();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
