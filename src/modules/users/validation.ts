import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().trim().min(1, "Role is required"),
  contact: z.string().trim().min(7, "Contact is required"),
});

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").optional(),
  email: z.string().trim().email("Enter a valid email").optional(),
  role: z.string().trim().min(1, "Role is required").optional(),
  contact: z.string().trim().min(7, "Contact is required").optional(),
});
