import { Router } from "express";
import { createEvent, deleteEvent, joinEvent, listEvents, updateEvent } from "../controllers/eventController.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/role.js";
import { facultyMiddleware } from "../middleware/faculty.js";

const router = Router();

router.get("/", authMiddleware, facultyMiddleware(), listEvents);
router.post("/:id/join", authMiddleware, facultyMiddleware(), joinEvent);
router.post("/", authMiddleware, roleMiddleware("admin"), createEvent);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateEvent);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteEvent);

export default router;
