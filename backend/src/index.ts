import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
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
import notificationRoutes from "./routes/notificationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { startSchedulers } from "./utils/scheduler.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const corsOptions = {
  origin: (_origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) =>
    callback(null, true),
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(uploadsDir));

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
app.use("/api/notifications", notificationRoutes);
app.use("/api/contact", contactRoutes);

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
