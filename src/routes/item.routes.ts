import { Router } from "express";
import * as itemController from "../controllers/item.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createItemSchema, updateItemSchema } from "../utils/schemas/item.schema";

const router = Router();

// Every route below runs requireAuth first, so req.user is always available.
router.use(requireAuth);

/**
 * @openapi
 * /api/items:
 *   get:
 *     summary: List all items in the caller's organization
 *     tags: [Items]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Item' }
 *       401: { description: Missing, invalid, or expired token }
 */
router.get("/", itemController.listHandler);

/**
 * @openapi
 * /api/items/{id}:
 *   get:
 *     summary: Get a single item by id
 *     tags: [Items]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The item
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Item' }
 *       404: { description: Not found }
 *       401: { description: Missing, invalid, or expired token }
 */
router.get("/:id", itemController.getHandler);

/**
 * @openapi
 * /api/items:
 *   post:
 *     summary: Create a new item in the caller's organization
 *     tags: [Items]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateItemInput' }
 *     responses:
 *       201:
 *         description: Item created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Item' }
 *       409: { description: SKU already exists in this organization }
 *       400: { description: Validation error }
 *       401: { description: Missing, invalid, or expired token }
 */
router.post("/", validate(createItemSchema), itemController.createHandler);

/**
 * @openapi
 * /api/items/{id}:
 *   patch:
 *     summary: Update an item
 *     tags: [Items]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateItemInput' }
 *     responses:
 *       200:
 *         description: Item updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Item' }
 *       404: { description: Not found }
 *       409: { description: SKU already exists in this organization }
 *       400: { description: Validation error }
 *       401: { description: Missing, invalid, or expired token }
 */
router.patch("/:id", validate(updateItemSchema), itemController.updateHandler);

/**
 * @openapi
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Item deleted }
 *       404: { description: Not found }
 *       401: { description: Missing, invalid, or expired token }
 */
router.delete("/:id", itemController.deleteHandler);

export default router;
