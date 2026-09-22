import { JwtPayload } from "../utils/jwt";

// TypeScript doesn't know Express's Request object can carry a `user` field
// until we tell it, via "declaration merging". This file adds that field
// to the global Express namespace so `req.user` is typed everywhere.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
