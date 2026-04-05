import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Event } from "../models/Event.js";
import { User } from "../models/User.js";
import { sendNotification } from "../utils/notifications.js";

export const listEvents = asyncHandler(async (req: Request, res: Response) => {
  const filter = req.facultyFilter ? req.facultyFilter : {};
  let query = Event.find(filter).sort({ date: 1 });
  if (req.user?.role === "admin") {
    query = query.populate("attendees", "name email phone");
  }
  const events = await query;
  res.json(events);
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, date, faculty } = req.body;
  if (!title || !date || !faculty) {
    res.status(400);
    throw new Error("Missing fields");
  }
  const event = await Event.create({
    title,
    description,
    date,
    faculty,
    createdBy: req.user?._id,
    attendees: []
  });

  const recipients = await User.find({ faculty }).select("_id");
  recipients.forEach((recipient) => {
    sendNotification({
      type: "event_alert",
      userId: String(recipient._id),
      message: `New event: ${title}`
    });
  });

  res.status(201).json(event);
});

export const joinEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  if (req.user?.role !== "student") {
    res.status(403);
    throw new Error("Only students can join events");
  }

  if (String(event.faculty) !== String(req.user.faculty)) {
    res.status(403);
    throw new Error("Faculty access restricted");
  }

  const userId = String(req.user._id);
  if (!event.attendees.map(String).includes(userId)) {
    event.attendees.push(req.user._id);
    await event.save();
  }

  res.json(event);
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  if (req.facultyFilter && String(event.faculty) !== String((req.facultyFilter as any).faculty)) {
    res.status(403);
    throw new Error("Faculty access restricted");
  }

  event.title = req.body.title || event.title;
  event.description = req.body.description ?? event.description;
  event.date = req.body.date || event.date;
  await event.save();

  res.json(event);
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  if (req.facultyFilter && String(event.faculty) !== String((req.facultyFilter as any).faculty)) {
    res.status(403);
    throw new Error("Faculty access restricted");
  }
  await event.deleteOne();
  res.json({ message: "Event deleted" });
});
