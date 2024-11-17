import { z } from "zod";


export const formSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),
  code: z.string().max(6, "Code is required"),
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


export type FormSchemaType = z.infer<typeof formSchema>;
