import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

/**
 * Runs before any protected route. Expects a header:
 *   Authorization: Bearer <token>
 * If valid, attaches the decoded payload to req.user so later
 * middleware/controllers know who is making the request and which
 * organization they belong to.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or malformed Authorization header" });
  }

  const token = header.split(" ")[1];

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Restricts a route to specific roles. Use AFTER requireAuth, e.g.:
 *   router.delete("/:id", requireAuth, requireRole("ADMIN"), controller.remove)
 */
export function requireRole(...allowedRoles: Array<"ADMIN" | "STAFF">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have permission to do this" });
    }
    next();
  };
}
