import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import lostItemRoutes from "./routes/lostItemRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { startSchedulers } from "./utils/scheduler.js";

const app = express();

app.use(cors({ origin: env.appUrl, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "CampusConnect API", version: "1.0.0" });
});

app.use("/api/auth", authRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/lost-items", lostItemRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);

app.use(notFound);
app.use(errorHandler);

connectDb()
  .then(() => {
    startSchedulers();
    app.listen(env.port, () => {
      console.log(`API listening on port ${env.port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
  });
