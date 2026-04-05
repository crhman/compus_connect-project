import { Router } from "express";
import { listBookings } from "../controllers/bookingController.js";
import { listFacultyStudents, setTeacherAvailability, setTeacherSubjects } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/role.js";
import { facultyMiddleware } from "../middleware/faculty.js";

const router = Router();

router.get("/bookings", authMiddleware, roleMiddleware("teacher"), facultyMiddleware(), listBookings);
router.get("/students", authMiddleware, roleMiddleware("teacher"), listFacultyStudents);
router.put("/subjects", authMiddleware, roleMiddleware("teacher"), setTeacherSubjects);
router.put("/availability", authMiddleware, roleMiddleware("teacher"), setTeacherAvailability);

export default router;
