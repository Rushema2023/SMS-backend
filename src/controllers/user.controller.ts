import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { getErrorResponse } from "../utils/error-response";

export async function listHandler(req: Request, res: Response) {
  const users = await userService.listUsers(req.user!.organizationId);
  res.json(users);
}

export async function getHandler(req: Request, res: Response) {
  try {
    const user = await userService.getUser(req.user!.organizationId, req.params.id);
    res.json(user);
  } catch (err: unknown) {
    const error = getErrorResponse(err);
    res.status(error.status).json({ error: error.message });
  }
}

export async function createHandler(req: Request, res: Response) {
  try {
    const user = await userService.createUser(req.user!.organizationId, req.body);
    res.status(201).json(user);
  } catch (err: unknown) {
    const error = getErrorResponse(err);
    res.status(error.status).json({ error: error.message });
  }
}

export async function updateHandler(req: Request, res: Response) {
  try {
    const user = await userService.updateUser(req.user!.organizationId, req.params.id, req.body);
    res.json(user);
  } catch (err: unknown) {
    const error = getErrorResponse(err);
    res.status(error.status).json({ error: error.message });
  }
}

export async function deleteHandler(req: Request, res: Response) {
  try {
    await userService.deleteUser(req.user!.organizationId, req.params.id);
    res.status(204).send();
  } catch (err: unknown) {
    const error = getErrorResponse(err);
    res.status(error.status).json({ error: error.message });
  }
}
