import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import crypto from "crypto";
import { User } from "../models/User.js";
import { Faculty } from "../models/Faculty.js";
import { signToken } from "../utils/token.js";
import { sendResetEmail } from "../utils/email.js";

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

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found with this email");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  user.resetPasswordToken = otp;
  user.resetPasswordExpires = new Date(Date.now() + 600000); // 10 minutes (shorter for OTP)
  await user.save();
  
  try {
    await sendResetEmail(user.email, otp);
    res.json({ message: "6-digit OTP sent to your email" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(500);
    throw new Error("Email could not be sent");
  }
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { otp, password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: otp,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired OTP code.");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
});
