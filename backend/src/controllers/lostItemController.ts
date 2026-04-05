import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { LostItem } from "../models/LostItem.js";

export const listLostItems = asyncHandler(async (req: Request, res: Response) => {
  const filter = req.facultyFilter ? req.facultyFilter : {};
  const items = await LostItem.find(filter).sort({ createdAt: -1 });
  res.json(items);
});

export const createLostItem = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, image, status } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }
  if (req.user?.role !== "student" && req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Only students can post lost items");
  }

  const item = await LostItem.create({
    title,
    description,
    image,
    status: status || "lost",
    faculty: req.user?.role === "admin" ? req.body.faculty : req.user?.faculty
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

  item.title = req.body.title || item.title;
  item.description = req.body.description ?? item.description;
  item.image = req.body.image ?? item.image;
  item.status = req.body.status || item.status;
  await item.save();

  res.json(item);
});
