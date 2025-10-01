import { z } from "zod";

export  const BoardSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
});

export type Board = z.infer<typeof BoardSchema>;

export const ListSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  // add more fields if needed (like cards, etc.)
});

export type List = z.infer<typeof ListSchema>;

export const ApiResponseSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    isSuccess: z.boolean().default(true).optional(),
    success: z.boolean().optional(),
    message: z.string().optional(),
    data: data.optional(),
  });

export const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const CardSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string(),
  description: z.string().optional(),
  listId: z.union([z.string(), z.number()]).optional(),
});

