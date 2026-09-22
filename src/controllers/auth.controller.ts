import { Request, Response } from "express";
import * as authService from "../services/auth.service";

// Controllers stay thin: parse the request, call the service, shape the
// response. All the actual logic lives in the service layer so it's easy
// to test and reuse.

export async function registerHandler(req: Request, res: Response) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
  }
}
