import { z } from "zod";

export const ApiResponseSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    isSuccess: z.boolean().optional(),
    success: z.boolean().optional(),
    message: z.string().optional(),
    data: data.optional(),
  });

export type InferApiResponse<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof ApiResponseSchema<T>>
>;

