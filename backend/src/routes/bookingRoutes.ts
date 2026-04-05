import { Router } from "express";
import { createBooking, listBookings, updateBookingStatus } from "../controllers/bookingController.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/role.js";
import { facultyMiddleware } from "../middleware/faculty.js";

const router = Router();

router.get("/", authMiddleware, facultyMiddleware(), listBookings);
router.post("/", authMiddleware, roleMiddleware("student"), facultyMiddleware(), createBooking);
router.patch("/:id/status", authMiddleware, roleMiddleware("teacher"), facultyMiddleware(), updateBookingStatus);

export default router;
