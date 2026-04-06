import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Group } from "../models/Group.js";
import { Faculty } from "../models/Faculty.js";

export const listGroups = asyncHandler(async (req: Request, res: Response) => {
  let filter = req.facultyFilter ? req.facultyFilter : {};
  if (req.user?.role === "student" && req.user.classLevel) {
    filter = { ...filter, classLevel: req.user.classLevel };
  } else if (req.user?.role === "student" && !req.user.classLevel) {
    res.json([]);
    return;
  }
  const groups = await Group.find(filter).sort({ name: 1 });
  res.json(groups);
});

export const createGroup = asyncHandler(async (req: Request, res: Response) => {
  const { name, subject, faculty, classLevel } = req.body;
  if (!name || !subject || !faculty || !classLevel) {
    res.status(400);
    throw new Error("Missing fields");
  }
  if (!req.user || !["teacher", "admin"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Only teachers or admins can create groups");
  }
  if (req.user.role !== "admin" && String(req.user.faculty) !== String(faculty)) {
    res.status(403);
    throw new Error("Faculty access restricted");
  }
  const facultyDoc = await Faculty.findById(faculty);
  if (!facultyDoc) {
    res.status(400);
    throw new Error("Invalid faculty selection");
  }
  if (facultyDoc.semesters?.length && !facultyDoc.semesters.includes(classLevel)) {
    res.status(400);
    throw new Error("Invalid class level for selected faculty");
  }
  const group = await Group.create({
    name,
    subject,
    faculty,
    members: [],
    createdBy: req.user._id,
    classLevel,
    materials: [],
    assignments: []
  });
  res.status(201).json(group);
});

export const joinGroup = asyncHandler(async (req: Request, res: Response) => {
  const groupId = req.params.id || req.body.groupId;
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404);
    throw new Error("Group not found");
  }

  if (req.user?.role !== "student") {
    res.status(403);
    throw new Error("Only students can join groups");
  }

  if (String(group.faculty) !== String(req.user.faculty)) {
    res.status(403);
    throw new Error("Faculty access restricted");
  }

  if (req.user.role === "student" && req.user.classLevel && group.classLevel !== req.user.classLevel) {
    res.status(403);
    throw new Error("Class access restricted");
  }

  const userId = req.user._id;
  if (!group.members.map(String).includes(String(userId))) {
    group.members.push(userId);
    await group.save();
  }

  res.json(group);
});

export const leaveGroup = asyncHandler(async (req: Request, res: Response) => {
  const groupId = req.params.id || req.body.groupId;
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404);
    throw new Error("Group not found");
  }

  if (req.user?.role !== "student") {
    res.status(403);
    throw new Error("Only students can leave groups");
  }

  if (String(group.faculty) !== String(req.user.faculty)) {
    res.status(403);
    throw new Error("Faculty access restricted");
  }

  const userId = String(req.user._id);
  group.members = group.members.filter((memberId) => String(memberId) !== userId);
  await group.save();
  res.json(group);
});

export const addGroupMaterial = asyncHandler(async (req: Request, res: Response) => {
  const { title, url } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }
  const group = await Group.findById(req.params.id);
  if (!group) {
    res.status(404);
    throw new Error("Group not found");
  }
  if (!req.user || !["teacher", "admin"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Only teachers can add materials");
  }
  if (req.user.role !== "admin" && String(group.createdBy) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only the group owner can add materials");
  }

  group.materials.push({ title, url, createdAt: new Date() });
  await group.save();
  res.json(group);
});

export const addGroupAssignment = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, dueDate } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }
  const group = await Group.findById(req.params.id);
  if (!group) {
    res.status(404);
    throw new Error("Group not found");
  }
  if (!req.user || !["teacher", "admin"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Only teachers can add assignments");
  }
  if (req.user.role !== "admin" && String(group.createdBy) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only the group owner can add assignments");
  }

  group.assignments.push({
    title,
    description,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    createdAt: new Date()
  });
  await group.save();
  res.json(group);
});
