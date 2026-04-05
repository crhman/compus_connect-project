import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Unauthorized");
    }
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("Forbidden");
    }
    next();
  };
};
