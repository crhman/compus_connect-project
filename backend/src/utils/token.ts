import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { IUser } from "../models/User.js";

export function signToken(user: IUser) {
  return jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}
