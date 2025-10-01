import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const getToken = () => localStorage.getItem("token");

export const axiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_SERVER_URL as string) || "",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {} as any;
      }
      // Prefer set() when available on AxiosHeaders, otherwise assign
      const maybeHeaders: any = config.headers as any;
      if (typeof maybeHeaders.set === "function") {
        maybeHeaders.set("Authorization", `Bearer ${token}`);
      } else {
        (config.headers as any) = {
          ...(config.headers as any),
          Authorization: `Bearer ${token}`,
        } as any;
      }
    }
    return config;
  },
  (err) => Promise.reject(err)
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

export type ApiError = { isSuccess?: boolean; message?: string } | any;

export async function handleRequest<T>(
  request: Promise<AxiosResponse<T>>
): Promise<T> {
  try {
    const response = await request;
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    if (error?.response?.data) {
      return Promise.reject(error.response.data as ApiError);
    }
    return Promise.reject({
      isSuccess: false,
      message: error?.message ?? "Unknown error occurred",
    });
  }
}

export function validate<T>(
  data: unknown,
  parser: { parse: (d: unknown) => T }
): T {
  return parser.parse(data);
}
