import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (import.meta.env.DEV) {
      console.error("API Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: originalRequest,
      });
    }

    if (
      error.response?.status === 401 &&
      error.response.data.message === "Unauthorized" &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");

        return api(originalRequest);
      } catch (error: unknown) {
        window.location.href = "/login";
        return Promise.resolve(error);
      }
    }
    return originalRequest.url === "/auth/refresh"
      ? Promise.resolve()
      : Promise.reject(error);
  }
);

export default api;
