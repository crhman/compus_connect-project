import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Booking } from "../models/Booking.js";
import { User } from "../models/User.js";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const isTimeWithinSlot = (time: Date, from: string, to: string) => {
  const [fromHour, fromMinute] = from.split(":").map(Number);
  const [toHour, toMinute] = to.split(":").map(Number);
  const minutes = time.getHours() * 60 + time.getMinutes();
  const fromMinutes = fromHour * 60 + fromMinute;
  const toMinutes = toHour * 60 + toMinute;
  return minutes >= fromMinutes && minutes < toMinutes;
};

export const listBookings = asyncHandler(async (req: Request, res: Response) => {
  let filter: Record<string, unknown> = {};

  if (req.user?.role === "student") {
    filter.student = req.user._id;
  } else if (req.user?.role === "teacher") {
    filter.teacher = req.user._id;
  }

  if (req.facultyFilter) {
    filter = { ...filter, ...req.facultyFilter };
  }

  const bookings = await Booking.find(filter)
    .populate("student", "name email")
    .sort({ time: 1 });
  res.json(bookings);
});

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const { teacher, time, studentName, studentWhatsapp } = req.body;
  if (!teacher || !time || !studentName || !studentWhatsapp) {
    res.status(400);
    throw new Error("Missing fields");
  }

  const selectedTime = new Date(time);
  if (Number.isNaN(selectedTime.getTime())) {
    res.status(400);
    throw new Error("Invalid time");
  }
  if (selectedTime.getTime() <= Date.now()) {
    res.status(400);
    throw new Error("Booking time must be in the future");
  }

  if (req.user?.role !== "student") {
    res.status(403);
    throw new Error("Only students can book sessions");
  }

  const teacherUser = await User.findById(teacher);
  if (!teacherUser || teacherUser.role !== "teacher") {
    res.status(400);
    throw new Error("Teacher not found");
  }

  if (String(teacherUser.faculty) !== String(req.user.faculty)) {
    res.status(403);
    throw new Error("Faculty access restricted");
  }

  const dayName = dayNames[selectedTime.getDay()];
  const slot = teacherUser.availability.find((item) => item.day === dayName && isTimeWithinSlot(selectedTime, item.from, item.to));
  if (!slot) {
    res.status(400);
    throw new Error("Teacher is not available at the selected time");
  }

  const [fromHour, fromMinute] = slot.from.split(":").map(Number);
  const [toHour, toMinute] = slot.to.split(":").map(Number);
  const start = new Date(selectedTime);
  start.setHours(fromHour, fromMinute, 0, 0);
  const end = new Date(selectedTime);
  end.setHours(toHour, toMinute, 0, 0);

  const bookedCount = await Booking.countDocuments({
    teacher: teacherUser._id,
    status: { $in: ["pending", "accepted"] },
    time: { $gte: start, $lt: end }
  });

  if (bookedCount >= 1) {
    res.status(409);
    throw new Error("Selected time is fully booked");
  }

  const booking = await Booking.create({
    student: req.user._id,
    teacher: teacherUser._id,
    faculty: req.user.faculty,
    time,
    studentName,
    studentWhatsapp,
    status: "pending"
  });

  res.status(201).json(booking);
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (req.user?.role !== "teacher") {
    res.status(403);
    throw new Error("Only teachers can update booking status");
  }

  if (String(booking.teacher) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not your booking");
  }

  if (!status || !["accepted", "rejected", "completed"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  booking.status = status;
  await booking.save();
  res.json(booking);
});
