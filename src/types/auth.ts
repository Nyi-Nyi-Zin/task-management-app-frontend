import type { LoginFormValues } from "@/schemas/auth/login.schema";
import type { User } from "./user";

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  user: User;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthContextType {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  login: (credentials: LoginFormValues) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loginLoading: boolean;
}
