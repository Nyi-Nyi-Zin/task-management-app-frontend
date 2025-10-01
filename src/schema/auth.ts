import { z } from "zod";

export const LoginPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterPayloadSchema = LoginPayloadSchema;

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const LoginResponseSchema = z.object({
  message: z.string(),
  isSuccess: z.boolean(),
  token: z.string(),
  user: UserSchema,
});

export const RegisterResponseSchema = z.object({
  message: z.string(),
  isSuccess: z.boolean(),
});

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;
export type RegisterPayload = z.infer<typeof RegisterPayloadSchema>;

