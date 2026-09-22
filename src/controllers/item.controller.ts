import { Request, Response } from "express";
import * as itemService from "../services/item.service";
import { getErrorResponse } from "../utils/error-response";

// req.user is guaranteed to exist here because requireAuth runs first
// on every one of these routes (see item.routes.ts).

export async function listHandler(req: Request, res: Response) {
  const items = await itemService.listItems(req.user!.organizationId);
  res.json(items);
}

export async function getHandler(req: Request, res: Response) {
  try {
    const item = await itemService.getItem(req.user!.organizationId, req.params.id);
    res.json(item);
  } catch (err: unknown) {
    const error = getErrorResponse(err);
    res.status(error.status).json({ error: error.message });
  }
}

export async function createHandler(req: Request, res: Response) {
  try {
    const item = await itemService.createItem(req.user!.organizationId, req.body);
    res.status(201).json(item);
  } catch (err: unknown) {
    const error = getErrorResponse(err);
    res.status(error.status).json({ error: error.message });
  }
}

export async function updateHandler(req: Request, res: Response) {
  try {
    const item = await itemService.updateItem(req.user!.organizationId, req.params.id, req.body);
    res.json(item);
  } catch (err: unknown) {
    const error = getErrorResponse(err);
    res.status(error.status).json({ error: error.message });
  }
}

export async function deleteHandler(req: Request, res: Response) {
  try {
    await itemService.deleteItem(req.user!.organizationId, req.params.id);
    res.status(204).send();
  } catch (err: unknown) {
    const error = getErrorResponse(err);
    res.status(error.status).json({ error: error.message });
  }
}
