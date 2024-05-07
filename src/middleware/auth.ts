import { Request, Response, NextFunction } from "express";
import HttpError from "../utils/httpError";
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return next(new HttpError("not authorization session please login first", 404));
  }

  next();
}
