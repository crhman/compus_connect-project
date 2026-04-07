import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Notification } from "../models/Notification.js";

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(notifications);
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }
  await Notification.updateMany(
    { recipient: req.user._id, status: "unread" },
    { $set: { status: "read" } }
  );
  res.json({ message: "All notifications marked as read" });
});

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    status: "unread"
  });
  res.json({ count });
});
