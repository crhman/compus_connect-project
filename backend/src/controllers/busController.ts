import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Bus } from "../models/Bus.js";
import { BusSchedule } from "../models/BusSchedule.js";
import { BusBooking } from "../models/BusBooking.js";

export const listBuses = asyncHandler(async (req: Request, res: Response) => {
  const filter = req.facultyFilter ? req.facultyFilter : {};
  const buses = await Bus.find(filter).sort({ name: 1 });
  res.json(buses);
});

export const listBusRoutes = asyncHandler(async (req: Request, res: Response) => {
  const filter = req.facultyFilter ? req.facultyFilter : {};
  const buses = await Bus.find(filter).sort({ name: 1 });
  res.json(buses);
});

export const createBus = asyncHandler(async (req: Request, res: Response) => {
  const { name, from, to, route, faculty, schedule } = req.body;
  if (!name || !from || !to || !faculty) {
    res.status(400);
    throw new Error("Missing fields");
  }
  const bus = await Bus.create({
    name,
    from,
    to,
    route: route || `${from} - ${to}`,
    faculty,
    schedule
  });
  res.status(201).json(bus);
});

export const updateBus = asyncHandler(async (req: Request, res: Response) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }
  if (req.facultyFilter && String(bus.faculty) !== String((req.facultyFilter as any).faculty)) {
    res.status(403);
    throw new Error("Faculty access restricted");
  }
  bus.name = req.body.name || bus.name;
  bus.from = req.body.from || bus.from;
  bus.to = req.body.to || bus.to;
  bus.route = req.body.route || `${bus.from} - ${bus.to}`;
  bus.schedule = req.body.schedule ?? bus.schedule;
  await bus.save();
  res.json(bus);
});

export const deleteBus = asyncHandler(async (req: Request, res: Response) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }
  if (req.facultyFilter && String(bus.faculty) !== String((req.facultyFilter as any).faculty)) {
    res.status(403);
    throw new Error("Faculty access restricted");
  }
  await bus.deleteOne();
  res.json({ message: "Bus deleted" });
});

export const listBusSchedules = asyncHandler(async (req: Request, res: Response) => {
  const busId = req.params.id || (typeof req.query.busId === "string" ? req.query.busId : undefined);
  if (!busId) {
    res.status(400);
    throw new Error("Bus id is required");
  }

  const filter: Record<string, unknown> = { bus: busId };
  if (req.facultyFilter) {
    filter.faculty = (req.facultyFilter as any).faculty;
  }

  const dateQuery = typeof req.query.date === "string" ? req.query.date : undefined;
  if (dateQuery) {
    const start = new Date(dateQuery);
    if (Number.isNaN(start.getTime())) {
      res.status(400);
      throw new Error("Invalid date");
    }
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filter.date = { $gte: start, $lt: end };
  }

  const schedules = await BusSchedule.find(filter).sort({ date: 1, time: 1 });
  const enriched = await Promise.all(
    schedules.map(async (schedule) => {
      const booked = await BusBooking.countDocuments({
        schedule: schedule._id,
        status: { $in: ["pending", "paid"] }
      });
      return {
        ...schedule.toObject(),
        booked,
        spotsLeft: Math.max(0, schedule.capacity - booked)
      };
    })
  );

  res.json(enriched);
});

export const createBusSchedule = asyncHandler(async (req: Request, res: Response) => {
  const busId = req.params.id;
  const { date, time, capacity, price } = req.body;
  if (!busId || !date || !time) {
    res.status(400);
    throw new Error("Missing fields");
  }

  const bus = await Bus.findById(busId);
  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }

  const scheduleDate = new Date(date);
  if (Number.isNaN(scheduleDate.getTime())) {
    res.status(400);
    throw new Error("Invalid date");
  }
  scheduleDate.setHours(0, 0, 0, 0);

  const schedule = await BusSchedule.create({
    bus: bus._id,
    faculty: bus.faculty,
    date: scheduleDate,
    time,
    capacity: typeof capacity === "number" ? capacity : 30,
    price: typeof price === "number" ? price : 0,
    createdBy: req.user?._id
  });

  res.status(201).json(schedule);
});

export const updateBusSchedule = asyncHandler(async (req: Request, res: Response) => {
  const schedule = await BusSchedule.findById(req.params.scheduleId);
  if (!schedule) {
    res.status(404);
    throw new Error("Schedule not found");
  }

  if (req.body.date) {
    const scheduleDate = new Date(req.body.date);
    if (Number.isNaN(scheduleDate.getTime())) {
      res.status(400);
      throw new Error("Invalid date");
    }
    scheduleDate.setHours(0, 0, 0, 0);
    schedule.date = scheduleDate;
  }

  if (req.body.time !== undefined) {
    schedule.time = req.body.time;
  }
  if (req.body.capacity !== undefined) {
    schedule.capacity = req.body.capacity;
  }
  if (req.body.price !== undefined) {
    schedule.price = req.body.price;
  }

  await schedule.save();
  res.json(schedule);
});

export const deleteBusSchedule = asyncHandler(async (req: Request, res: Response) => {
  const schedule = await BusSchedule.findById(req.params.scheduleId);
  if (!schedule) {
    res.status(404);
    throw new Error("Schedule not found");
  }
  await schedule.deleteOne();
  res.json({ message: "Schedule deleted" });
});

export const createBusBooking = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "student") {
    res.status(403);
    throw new Error("Only students can book buses");
  }

  const { scheduleId, paymentMethod } = req.body;
  if (!scheduleId) {
    res.status(400);
    throw new Error("Schedule is required");
  }

  const schedule = await BusSchedule.findById(scheduleId);
  if (!schedule) {
    res.status(404);
    throw new Error("Schedule not found");
  }

  if (String(schedule.faculty) !== String(req.user.faculty)) {
    res.status(403);
    throw new Error("Faculty access restricted");
  }

  const existing = await BusBooking.findOne({
    student: req.user._id,
    schedule: schedule._id,
    status: { $in: ["pending", "paid"] }
  });
  if (existing) {
    res.status(409);
    throw new Error("You already booked this schedule");
  }

  const booked = await BusBooking.countDocuments({
    schedule: schedule._id,
    status: { $in: ["pending", "paid"] }
  });
  if (booked >= schedule.capacity) {
    res.status(400);
    throw new Error("Bus schedule is full");
  }

  const amount = schedule.price || 0;
  if (amount > 0 && !paymentMethod) {
    res.status(400);
    throw new Error("Payment method is required");
  }

  const status = amount > 0 ? "pending" : "paid";
  const booking = await BusBooking.create({
    student: req.user._id,
    bus: schedule.bus,
    schedule: schedule._id,
    faculty: schedule.faculty,
    amount,
    paymentMethod: paymentMethod || "",
    status,
    paidAt: status === "paid" ? new Date() : undefined
  });

  res.status(201).json(booking);
});

export const listMyBusBookings = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const bookings = await BusBooking.find({ student: req.user._id })
    .populate("bus", "name from to")
    .populate("schedule", "date time price")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

export const listBusBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await BusBooking.find()
    .populate("student", "name email phone")
    .populate("bus", "name from to")
    .populate("schedule", "date time price")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

export const payBusBooking = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "student") {
    res.status(403);
    throw new Error("Only students can pay");
  }

  const booking = await BusBooking.findById(req.params.bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (String(booking.student) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Access restricted");
  }
  if (booking.status !== "pending") {
    res.status(400);
    throw new Error("Booking is not pending");
  }

  booking.status = "paid";
  booking.paymentMethod = req.body.paymentMethod || booking.paymentMethod;
  booking.paidAt = new Date();
  await booking.save();

  res.json(booking);
});

export const cancelBusBooking = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "student") {
    res.status(403);
    throw new Error("Only students can cancel");
  }

  const booking = await BusBooking.findById(req.params.bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (String(booking.student) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Access restricted");
  }

  booking.status = "cancelled";
  await booking.save();
  res.json(booking);
});
