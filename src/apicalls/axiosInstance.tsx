import axios, { AxiosError, AxiosResponse } from "axios";

// const getFreshLocalStorage = () => {
//   const refreshToken = localStorage.getItem("token");
//   return refreshToken;
// };

const getToken = () => localStorage.getItem("token");

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const handleRequest = async <T,>(
  request: Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.data) {
        return Promise.reject(error.response.data);
      }
      return Promise.reject({ isSuccess: false, message: error.message });
    }
    return Promise.reject({
      isSuccess: false,
      message: "Unknown error occurred",
    });
  }
};
