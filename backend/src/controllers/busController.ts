import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Bus } from "../models/Bus.js";

export const listBuses = asyncHandler(async (req: Request, res: Response) => {
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
