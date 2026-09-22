import { Router } from "express";
import { registerHandler, loginHandler } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { registerSchema, loginSchema } from "../utils/schemas/auth.schema";

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new organization and its first admin user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [organizationName, name, email, password]
 *             properties:
 *               organizationName: { type: string, example: "Acme Ltd" }
 *               name: { type: string, example: "Jane Doe" }
 *               email: { type: string, example: "jane@acme.com" }
 *               password: { type: string, example: "supersecret123" }
 *     responses:
 *       201: { description: Organization and admin user created, returns JWT }
 *       409: { description: Email already in use }
 */
router.post("/register", validate(registerSchema), registerHandler);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in and receive a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Logged in, returns JWT }
 *       401: { description: Invalid credentials }
 */
router.post("/login", validate(loginSchema), loginHandler);

export default router;
