import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Wraps a zod schema into an Express middleware. If req.body doesn't match
 * the schema, we reject the request before it ever reaches the controller —
 * so controllers can trust that the data shape is already correct.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.flatten().fieldErrors,
      });
    }

    req.body = result.data;
    next();
  };
}
