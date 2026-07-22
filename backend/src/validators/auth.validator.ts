import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters")
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((value) => /[a-z]/.test(value), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((value) => /\d/.test(value), {
      message: "Password must contain at least one number",
    })
    .refine((value) => /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/.test(value), {
      message: "Password must contain at least one special character",
    })
    .refine((value) => value === value.trim(), {
      message: "Password must not contain leading or trailing spaces",
    }),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;


export const loginUserSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters")
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((value) => /[a-z]/.test(value), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((value) => /\d/.test(value), {
      message: "Password must contain at least one number",
    })
    .refine((value) => /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/.test(value), {
      message: "Password must contain at least one special character",
    })
    .refine((value) => value === value.trim(), {
      message: "Password must not contain leading or trailing spaces",
    }),
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;
