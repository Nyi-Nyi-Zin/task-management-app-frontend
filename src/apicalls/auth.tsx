import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "../types/Auth";
import { ApiResponse } from "../types/Auth";
import { User } from "../types/User";
import { axiosInstance } from "./axiosInstance";
import { AxiosError } from "axios";

export const registerUser = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.post<RegisterResponse>(
      "/register",
      payload
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<RegisterResponse>;
    throw error.response?.data ?? { success: false, message: "Unknown error" };
  }
};

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/login", payload);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<LoginResponse>;
    throw error.response?.data ?? { success: false, message: "Unknown error" };
  }
};

export const checkCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>(
      "/get-current-user",
      {
        validateStatus: () => true,
      }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    return {
      success: false,
      data: null,
      message: error.message,
    };
  }
};
