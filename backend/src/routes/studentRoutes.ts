import { Router } from "express";
import { createBooking } from "../controllers/bookingController.js";
import { joinGroup } from "../controllers/groupController.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/role.js";
import { facultyMiddleware } from "../middleware/faculty.js";

const router = Router();

router.post("/booking", authMiddleware, roleMiddleware("student"), facultyMiddleware(), createBooking);
router.post("/groups/join", authMiddleware, roleMiddleware("student"), joinGroup);

export default router;
