import { Request, Response, NextFunction } from "express";

export const facultyMiddleware = (options?: { allowOverride?: boolean }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    if (req.user.role === "admin") {
      return next();
    }

    req.facultyFilter = { faculty: req.user.faculty };

    if (req.body && req.body.faculty) {
      const requestedFaculty = String(req.body.faculty);
      const userFaculty = String(req.user.faculty);
      if (requestedFaculty !== userFaculty) {
        res.status(403);
        throw new Error("Faculty access restricted");
      }
    }

    if (options?.allowOverride) {
      req.body = { ...req.body, faculty: req.user.faculty };
    }

    next();
  };
};
