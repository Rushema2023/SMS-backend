import { z } from "zod";

// Used by an ADMIN to add a new teammate to their organization.
export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "STAFF"]).default("STAFF"),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["ADMIN", "STAFF"]).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
