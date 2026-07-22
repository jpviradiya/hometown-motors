import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string({error:"Name is Require"}).min(1, "Name is required"),
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
