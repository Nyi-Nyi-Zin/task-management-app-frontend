import { ApiResponse } from "../types/Auth";
import { User } from "../types/User";
import { axiosInstance, handleRequest, validate } from "./axiosInstance";
import {
  LoginPayloadSchema,
  RegisterPayloadSchema,
  LoginResponseSchema,
  RegisterResponseSchema,
  type LoginPayload,
  type RegisterPayload,
} from "../schema/auth";

export const registerUser = async (payload: RegisterPayload) => {
  const safePayload = validate(payload, RegisterPayloadSchema);
  const data = await handleRequest(
    axiosInstance.post("/register", safePayload)
  );
  return validate(data, RegisterResponseSchema);
};

export const loginUser = async (payload: LoginPayload) => {
  const safePayload = validate(payload, LoginPayloadSchema);
  const data = await handleRequest(axiosInstance.post("/login", safePayload));
  return validate(data, LoginResponseSchema);
};

export const checkCurrentUser = async (): Promise<
  ApiResponse<User> | { isSuccess?: false; message?: string; userDoc?: null }
> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>(
      "/get-current-user",
      { validateStatus: () => true }
    );
    return response.data;
  } catch (err) {
    const error = err as any;
    return {
      isSuccess: false,
      message: error?.message ?? "Unknown error",
      userDoc: null,
    };
  }
};
