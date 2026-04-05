import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { User } from "../models/User.js";
import { Faculty } from "../models/Faculty.js";
import { Booking } from "../models/Booking.js";

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role, faculty, bio, classLevel, phone } = req.body;
  if (!name || !email || !password || !role || !faculty) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  if (role === "student" && !classLevel) {
    res.status(400);
    throw new Error("Class level is required for students");
  }

  if (role !== "admin" && !phone) {
    res.status(400);
    throw new Error("Phone number is required");
  }

  const facultyDoc = await Faculty.findById(faculty);
  if (!facultyDoc) {
    res.status(400);
    throw new Error("Invalid faculty selection");
  }
  if (role === "student" && facultyDoc.semesters?.length) {
    if (!facultyDoc.semesters.includes(classLevel)) {
      res.status(400);
      throw new Error("Invalid class level for selected faculty");
    }
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error("Email already in use");
  }

  const user = await User.create({ name, email, password, role, faculty, bio, classLevel, phone });
  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    faculty: user.faculty,
    classLevel: user.classLevel,
    phone: user.phone
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.faculty = req.body.faculty || user.faculty;
  if (req.body.classLevel !== undefined) {
    user.classLevel = req.body.classLevel;
  }

  if (user.role === "student") {
    if (!user.classLevel) {
      res.status(400);
      throw new Error("Class level is required for students");
    }
    const facultyDoc = await Faculty.findById(user.faculty);
    if (facultyDoc?.semesters?.length && !facultyDoc.semesters.includes(user.classLevel)) {
      res.status(400);
      throw new Error("Invalid class level for selected faculty");
    }
  }
  user.bio = req.body.bio ?? user.bio;
  if (req.body.phone !== undefined) {
    user.phone = req.body.phone;
  }
  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    faculty: user.faculty,
    classLevel: user.classLevel,
    phone: user.phone
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await user.deleteOne();
  res.json({ message: "User deleted" });
});

export const listFacultyStudents = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== "teacher") {
    res.status(403);
    throw new Error("Only teachers can view students");
  }
  const students = await User.find({ role: "student", faculty: req.user.faculty }).select("-password");
  res.json(students);
});

export const listFacultyTeachers = asyncHandler(async (req: Request, res: Response) => {
  const filter = req.facultyFilter ? req.facultyFilter : {};
  const teachers = await User.find({ role: "teacher", ...filter }).select("-password");
  res.json(teachers);
});

export const getTeacherAvailability = asyncHandler(async (req: Request, res: Response) => {
  const teacherId = req.params.id;
  const teacher = await User.findById(teacherId);
  if (!teacher || teacher.role !== "teacher") {
    res.status(404);
    throw new Error("Teacher not found");
  }

  if (req.user?.role !== "admin" && String(teacher.faculty) !== String(req.user?.faculty)) {
    res.status(403);
    throw new Error("Faculty access restricted");
  }

  const dateQuery = typeof req.query.date === "string" ? req.query.date : undefined;
  const targetDate = dateQuery ? new Date(dateQuery) : new Date();
  if (Number.isNaN(targetDate.getTime())) {
    res.status(400);
    throw new Error("Invalid date");
  }

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[targetDate.getDay()];

  const slots = teacher.availability.filter((slot) => slot.day === dayName);
  if (!slots.length) {
    return res.json({ date: targetDate.toISOString(), day: dayName, slots: [] });
  }

  const capacity = 1;

  const slotResults = await Promise.all(
    slots.map(async (slot) => {
      const [fromHour, fromMinute] = slot.from.split(":").map(Number);
      const [toHour, toMinute] = slot.to.split(":").map(Number);
      const start = new Date(targetDate);
      start.setHours(fromHour, fromMinute, 0, 0);
      const end = new Date(targetDate);
      end.setHours(toHour, toMinute, 0, 0);

      const booked = await Booking.countDocuments({
        teacher: teacher._id,
        status: { $in: ["pending", "accepted"] },
        time: { $gte: start, $lt: end }
      });

      return {
        day: slot.day,
        from: slot.from,
        to: slot.to,
        capacity,
        booked,
        spotsLeft: Math.max(0, capacity - booked)
      };
    })
  );

  res.json({ date: targetDate.toISOString(), day: dayName, slots: slotResults });
});

export const setTeacherSubjects = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== "teacher") {
    res.status(403);
    throw new Error("Only teachers can set subjects");
  }
  const subjects = Array.isArray(req.body.subjects) ? req.body.subjects : [];
  req.user.subjects = subjects;
  await req.user.save();
  res.json(req.user);
});

export const setTeacherAvailability = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== "teacher") {
    res.status(403);
    throw new Error("Only teachers can set availability");
  }
  const availability = Array.isArray(req.body.availability) ? req.body.availability : [];
  req.user.availability = availability;
  await req.user.save();
  res.json(req.user);
});
