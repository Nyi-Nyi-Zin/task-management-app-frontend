// src/types/user.ts
import type { z } from "zod";
// import type { userFormSchema } from "@/schemas/auth/register.schema";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
}

export type UserListResponse = User[];

// export type UserFormValues = z.infer<typeof userFormSchema>;
