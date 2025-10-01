import { z } from "zod";

export const ListSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
});

export const CreateListPayloadSchema = z.object({
  boardId: z.string().min(1),
  title: z.string().min(1),
});

export type CreateListPayload = z.infer<typeof CreateListPayloadSchema>;

