import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  sku: z.string().trim().min(1, "SKU is required").max(80),
  quantity: z.number().int().nonnegative().default(0),
  unit: z.string().trim().min(1, "Unit is required").max(30).default("pcs"),
});

export const updateItemSchema = createItemSchema.partial().refine(
  (item) => Object.keys(item).length > 0,
  "Provide at least one field to update",
);

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
