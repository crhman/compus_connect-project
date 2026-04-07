import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { LostItem } from "../models/LostItem.js";

export const listLostItems = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = req.facultyFilter ? req.facultyFilter : {};
  const includeClaimed = req.query.includeClaimed === "true";
  if (req.user?.role !== "admin" && !includeClaimed) {
    filter.status = { $ne: "claimed" };
  }
  const items = await LostItem.find(filter).sort({ createdAt: -1 });
  res.json(items);
});

export const createLostItem = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, status, contactName, contactPhone, contactEmail } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only admins can post lost items");
  }

  const facultyId = req.body.faculty || req.user?.faculty;

  const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.image || "";

  const item = await LostItem.create({
    title,
    description,
    image: imagePath,
    status: status || "lost",
    faculty: facultyId,
    reportedBy: req.user?._id,
    contactName: contactName || req.user?.name || "",
    contactPhone: contactPhone || req.user?.phone || "",
    contactEmail: contactEmail || req.user?.email || ""
  });

  res.status(201).json(item);
});

export const updateLostItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await LostItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Lost item not found");
  }

  if (req.facultyFilter && String(item.faculty) !== String((req.facultyFilter as any).faculty)) {
    res.status(403);
    throw new Error("Faculty access restricted");
  }

  if (
    req.user?.role !== "admin" &&
    String(item.reportedBy || "") !== String(req.user?._id || "")
  ) {
    res.status(403);
    throw new Error("Only the reporter can update this item");
  }

  item.title = req.body.title || item.title;
  item.description = req.body.description ?? item.description;
  if (req.file) {
    item.image = `/uploads/${req.file.filename}`;
  } else if (req.body.image !== undefined) {
    item.image = req.body.image;
  }
  if (req.body.status && req.body.status !== item.status) {
    item.status = req.body.status;
    if (req.body.status === "claimed") {
      item.claimedAt = new Date();
    }
  }
  if (req.body.contactName !== undefined) {
    item.contactName = req.body.contactName;
  }
  if (req.body.contactPhone !== undefined) {
    item.contactPhone = req.body.contactPhone;
  }
  if (req.body.contactEmail !== undefined) {
    item.contactEmail = req.body.contactEmail;
  }
  await item.save();

  res.json(item);
});

export const deleteLostItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await LostItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Lost item not found");
  }

  if (
    req.user?.role !== "admin" &&
    String(item.reportedBy || "") !== String(req.user?._id || "")
  ) {
    res.status(403);
    throw new Error("Unauthorized to delete this item");
  }

  await item.deleteOne();
  res.json({ message: "Lost item removed" });
});

