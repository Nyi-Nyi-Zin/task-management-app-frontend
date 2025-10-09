import { useContext } from "react";
import { AuthContext } from "../contexts/auth-context";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { User } from "@/types/user";
import { LoginFormValues } from "@/schemas/auth/login.schema";
import { RegisterFormValues } from "@/schemas/auth/register.schema";
import { AuthContextType, LoginResponse } from "@/types/auth";

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useLogin(): UseMutationResult<LoginResponse, Error, LoginFormValues> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginFormValues) => authApi.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
    },
  });
}

// export function useCurrentUser() {
//   return useQuery<User>({
//     queryKey: ["currentUser"],
//     queryFn: () => authApi.getCurrentUser(),
//     staleTime: 1000 * 60 * 5,
//     retry: false,
//   });
// }

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation<User, Error, RegisterFormValues>({
    mutationFn: (data) => authApi.register(data),
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
    },
  });
}
