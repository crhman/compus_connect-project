import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Faculty } from "../models/Faculty.js";

export const listFaculties = asyncHandler(async (req: Request, res: Response) => {
  const faculties = await Faculty.find().sort({ name: 1 });
  res.json(faculties);
});

export const createFaculty = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, semesters } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }
  const faculty = await Faculty.create({
    name,
    description,
    semesters: Array.isArray(semesters) ? semesters : []
  });
  res.status(201).json(faculty);
});

export const updateFaculty = asyncHandler(async (req: Request, res: Response) => {
  const faculty = await Faculty.findById(req.params.id);
  if (!faculty) {
    res.status(404);
    throw new Error("Faculty not found");
  }
  faculty.name = req.body.name || faculty.name;
  faculty.description = req.body.description ?? faculty.description;
  if (req.body.semesters) {
    faculty.semesters = Array.isArray(req.body.semesters) ? req.body.semesters : faculty.semesters;
  }
  await faculty.save();
  res.json(faculty);
});

export const deleteFaculty = asyncHandler(async (req: Request, res: Response) => {
  const faculty = await Faculty.findById(req.params.id);
  if (!faculty) {
    res.status(404);
    throw new Error("Faculty not found");
  }
  await faculty.deleteOne();
  res.json({ message: "Faculty deleted" });
});
