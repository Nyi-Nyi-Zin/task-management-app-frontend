import { User } from "./User";

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  isSuccess: boolean;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  isSuccess: boolean;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  message?: string;
}
