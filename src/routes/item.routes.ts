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
 *       200: { description: List of items }
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
 *       200: { description: The item }
 *       404: { description: Not found }
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
 *           schema:
 *             type: object
 *             required: [name, sku]
 *             properties:
 *               name: { type: string }
 *               sku: { type: string }
 *               quantity: { type: integer }
 *               unit: { type: string }
 *     responses:
 *       201: { description: Item created }
 *       409: { description: SKU already exists in this organization }
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
 *     responses:
 *       200: { description: Item updated }
 *       404: { description: Not found }
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
 */
router.delete("/:id", itemController.deleteHandler);

export default router;
