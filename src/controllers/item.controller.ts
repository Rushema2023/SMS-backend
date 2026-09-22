import { Request, Response } from "express";
import * as itemService from "../services/item.service";

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
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
  }
}

export async function createHandler(req: Request, res: Response) {
  try {
    const item = await itemService.createItem(req.user!.organizationId, req.body);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
  }
}

export async function updateHandler(req: Request, res: Response) {
  try {
    const item = await itemService.updateItem(req.user!.organizationId, req.params.id, req.body);
    res.json(item);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
  }
}

export async function deleteHandler(req: Request, res: Response) {
  try {
    await itemService.deleteItem(req.user!.organizationId, req.params.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
  }
}
