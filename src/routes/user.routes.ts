import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createUserSchema, updateUserSchema } from "../utils/schemas/user.schema";

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: List all users in the caller's organization
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of users }
 */
router.get("/", userController.listHandler);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user by id
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: UUID of the user to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *     responses:
 *       200: { description: The user }
 *       404: { description: Not found }
 */
router.get("/:id", userController.getHandler);

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Add a new user to the organization (admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [ADMIN, STAFF] }
 *     responses:
 *       201: { description: User created }
 *       403: { description: Only admins can add users }
 */
router.post("/", requireRole("ADMIN"), validate(createUserSchema), userController.createHandler);

/**
 * @openapi
 * /api/users/{id}:
 *   patch:
 *     summary: Update a user's name or role (admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: UUID of the user to update
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *     responses:
 *       200: { description: User updated }
 *       403: { description: Only admins can update users }
 */
router.patch("/:id", requireRole("ADMIN"), validate(updateUserSchema), userController.updateHandler);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Remove a user from the organization (admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: UUID of the user to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *     responses:
 *       204: { description: User deleted }
 *       403: { description: Only admins can delete users }
 */
router.delete("/:id", requireRole("ADMIN"), userController.deleteHandler);

export default router;
