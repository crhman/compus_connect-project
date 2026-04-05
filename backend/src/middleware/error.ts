import { Request, Response, NextFunction } from "express";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  next(new Error(`Not Found: ${req.originalUrl}`));
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const status = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "" : err.stack
  });
}
