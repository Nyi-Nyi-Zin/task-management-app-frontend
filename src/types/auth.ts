import type { LoginSchema } from "@/schemas/auth.schema";
import type { UserResponse } from "./user";

export interface LoginResponse {
  success: boolean;
  message: string;
  user: Pick<UserResponse, "id" | "userId" | "name" | "email">;
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
  login: (credentials: LoginSchema) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}
