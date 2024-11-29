import { z } from "zod";

export const UnsafeZoneSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  proximity: z.number().optional(),
  severity: z.enum(["Low", "Medium", "High"]).refine((val) => val !== undefined, {
    message: "Severity is required",
  }),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
  video: z.string().optional(),
  audio: z.string().optional(),
});

export type UnsafeZoneSchemaType = z.infer<typeof UnsafeZoneSchema>;
