import { z } from "zod";

export const CardSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  listId: z.string().min(1),
});

export const CreateCardPayloadSchema = z.object({
  listId: z.string().min(1),
  title: z.string().min(1),
});

export type CreateCardPayload = z.infer<typeof CreateCardPayloadSchema>;

