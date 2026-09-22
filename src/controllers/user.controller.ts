import { Request, Response } from "express";
import * as userService from "../services/user.service";

export async function listHandler(req: Request, res: Response) {
  const users = await userService.listUsers(req.user!.organizationId);
  res.json(users);
}

export async function getHandler(req: Request, res: Response) {
  try {
    const user = await userService.getUser(req.user!.organizationId, req.params.id);
    res.json(user);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
  }
}

export async function createHandler(req: Request, res: Response) {
  try {
    const user = await userService.createUser(req.user!.organizationId, req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
  }
}

export async function updateHandler(req: Request, res: Response) {
  try {
    const user = await userService.updateUser(req.user!.organizationId, req.params.id, req.body);
    res.json(user);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
  }
}

export async function deleteHandler(req: Request, res: Response) {
  try {
    await userService.deleteUser(req.user!.organizationId, req.params.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
  }
}
