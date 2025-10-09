import api from "@/lib/axios/api";
import type { LoginResponse, RefreshResponse } from "@/types/auth";
import type { UserResponse } from "@/types/user";
import type { LoginSchema } from "@/schemas/auth.schema";

export const authApi = {
  login: async (credentials: LoginSchema): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  refresh: async (): Promise<RefreshResponse> => {
    const response = await api.post<RefreshResponse>("/auth/refresh");
    return response.data;
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>("/users/me");
    return response.data;
  },
};
