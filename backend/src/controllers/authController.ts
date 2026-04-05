import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { User } from "../models/User.js";
import { Faculty } from "../models/Faculty.js";
import { signToken } from "../utils/token.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role, faculty, bio, classLevel, phone } = req.body;

  if (!name || !email || !password || !role || !faculty) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  if (role === "admin") {
    res.status(403);
    throw new Error("Admin accounts must be created by admin");
  }

  if (!phone) {
    res.status(400);
    throw new Error("Phone number is required");
  }

  if (role === "student" && !classLevel) {
    res.status(400);
    throw new Error("Class level is required for students");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error("Email already in use");
  }

  const facultyExists = await Faculty.findById(faculty);
  if (!facultyExists) {
    res.status(400);
    throw new Error("Invalid faculty selection");
  }

  if (role === "student" && facultyExists.semesters?.length) {
    if (!facultyExists.semesters.includes(classLevel)) {
      res.status(400);
      throw new Error("Invalid class level for selected faculty");
    }
  }

  const user = await User.create({ name, email, password, role, faculty, bio, classLevel, phone });
  const token = signToken(user);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      faculty: user.faculty,
      bio: user.bio,
      classLevel: user.classLevel,
      phone: user.phone
    }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Missing credentials");
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = signToken(user);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      faculty: user.faculty,
      bio: user.bio,
      subjects: user.subjects,
      availability: user.availability,
      classLevel: user.classLevel,
      phone: user.phone
    }
  });
});
