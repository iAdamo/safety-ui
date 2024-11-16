import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
});

export const codeSchema = z.object({
  code: z.string().max(6, "Code is required"),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      new RegExp(".*[A-Z].*"),
      "Password must contain at least one uppercase letter"
    )
    .regex(
      new RegExp(".*[a-z].*"),
      "Password must contain at least one lowercase letter"
    )
    .regex(new RegExp(".*[0-9].*"), "Password must contain at least one number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "Password must contain at least one special character"
    ),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
});

export const formSchema = emailSchema
  .merge(codeSchema)
  .merge(passwordSchema);

export type EmailSchemaType = z.infer<typeof emailSchema>;
export type CodeSchemaType = z.infer<typeof codeSchema>;
export type PasswordSchemaType = z.infer<typeof passwordSchema>;
export type FormSchemaType = z.infer<typeof formSchema>;
