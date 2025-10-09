import React, { useEffect, useState } from "react";
import { authApi } from "@/api/auth";
import type { AuthenticatedUser, AuthContextType } from "../types/auth";
import { AuthContext } from "../contexts/auth-context";
import { loginSchema, type LoginFormValues } from "@/schemas/auth/login.schema";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.getCurrentUser();
        setUser({
          id: response.id,
          email: response.email,
          name: response.name,
        });
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginFormValues) => {
    const response = await authApi.login(credentials);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
