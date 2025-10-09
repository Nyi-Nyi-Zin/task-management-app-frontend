// import React, { createContext, useContext, useEffect, useState } from "react";
// import { authApi } from "@/api/auth";
// import { User } from "@/types/user";

// // Make sure User type matches backend
// // export interface User {
// //   id: number;
// //   name: string;
// //   email: string;
// // }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch current user on mount
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const user = await authApi.getCurrentUser();
//         console.log(user);
//         setUser(user);
//       } catch {
//         setUser(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   // Login function
//   const login = async (email: string, password: string) => {
//     const res = await authApi.login({ email, password });
//     setUser(res.user); // ✅ fix: use res.user, not res.data.user
//   };

//   // Logout function
//   const logout = async () => {
//     await authApi.logout();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook
// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };
