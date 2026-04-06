import { Router } from "express";
import {
  cancelBusBooking,
  createBus,
  createBusBooking,
  createBusSchedule,
  deleteBus,
  deleteBusSchedule,
  listBuses,
  listBusBookings,
  listBusRoutes,
  listBusSchedules,
  listMyBusBookings,
  payBusBooking,
  updateBus,
  updateBusSchedule
} from "../controllers/busController.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/role.js";
import { facultyMiddleware } from "../middleware/faculty.js";

const router = Router();

router.get("/routes", authMiddleware, facultyMiddleware(), listBusRoutes);
router.get("/:id/schedules", authMiddleware, facultyMiddleware(), listBusSchedules);

router.post("/bookings", authMiddleware, roleMiddleware("student"), createBusBooking);
router.get("/bookings/my", authMiddleware, roleMiddleware("student"), listMyBusBookings);
router.post("/bookings/:bookingId/pay", authMiddleware, roleMiddleware("student"), payBusBooking);
router.post("/bookings/:bookingId/cancel", authMiddleware, roleMiddleware("student"), cancelBusBooking);

router.get("/bookings", authMiddleware, roleMiddleware("admin"), listBusBookings);
router.post("/:id/schedules", authMiddleware, roleMiddleware("admin"), createBusSchedule);
router.put("/schedules/:scheduleId", authMiddleware, roleMiddleware("admin"), updateBusSchedule);
router.delete("/schedules/:scheduleId", authMiddleware, roleMiddleware("admin"), deleteBusSchedule);

router.get("/", authMiddleware, roleMiddleware("admin"), listBuses);
router.post("/", authMiddleware, roleMiddleware("admin"), createBus);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateBus);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteBus);

export default router;
