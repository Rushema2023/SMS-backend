import { z } from "zod";

// Registering creates BOTH a new organization AND its first admin user
// in one step — that's how a brand new tenant joins the system.
export const registerSchema = z.object({
  organizationName: z.string().min(2, "Organization name is too short"),
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
