import { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      facultyFilter?: Record<string, unknown>;
    }
  }
}

export {};
