import api from "@/lib/axios/api";
import type { LoginResponse, RefreshResponse } from "@/types/auth";
import type { CurrentUserResponse, User } from "@/types/user";
import type { LoginFormValues } from "@/schemas/auth/login.schema";
import { RegisterFormValues } from "@/schemas/auth/register.schema";

export const authApi = {
  login: async (credentials: LoginFormValues): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },
  register: async (data: RegisterFormValues): Promise<User> => {
    const response = await api.post<User>("/auth/register", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  refresh: async (): Promise<RefreshResponse> => {
    const response = await api.post<RefreshResponse>("/auth/refresh");
    return response.data;
  },

  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    const response = await api.get<CurrentUserResponse>("/me");
    return response.data;
  },
};
