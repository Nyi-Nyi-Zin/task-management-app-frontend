import { createContext } from "react";
import type { AuthContextType } from "@/lib/typ";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
