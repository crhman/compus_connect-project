import { Router } from "express";
import {
  createUser,
  deleteUser,
  listFacultyTeachers,
  getTeacherAvailability,
  listUsers,
  updateUser,
  getMe,
  updateAvatar
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/role.js";
import { facultyMiddleware } from "../middleware/faculty.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/me", authMiddleware, getMe);
router.post("/me/avatar", authMiddleware, upload.single("image"), updateAvatar);
router.get("/", authMiddleware, roleMiddleware("admin"), listUsers);
router.post("/", authMiddleware, roleMiddleware("admin"), createUser);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateUser);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteUser);

router.get("/teachers", authMiddleware, facultyMiddleware(), listFacultyTeachers);
router.get("/teachers/:id/availability", authMiddleware, getTeacherAvailability);

export default router;
