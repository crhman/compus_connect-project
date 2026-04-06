import { Router } from "express";
import {
  addGroupAssignment,
  addGroupMaterial,
  createGroup,
  joinGroup,
  leaveGroup,
  listGroups
} from "../controllers/groupController.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/role.js";
import { facultyMiddleware } from "../middleware/faculty.js";

const router = Router();

router.get("/", authMiddleware, facultyMiddleware(), listGroups);
router.post("/", authMiddleware, roleMiddleware("admin", "teacher"), createGroup);
router.post("/:id/materials", authMiddleware, roleMiddleware("admin", "teacher"), addGroupMaterial);
router.post("/:id/assignments", authMiddleware, roleMiddleware("admin", "teacher"), addGroupAssignment);
router.post("/join", authMiddleware, roleMiddleware("student"), joinGroup);
router.post("/:id/join", authMiddleware, roleMiddleware("student"), joinGroup);
router.post("/:id/leave", authMiddleware, roleMiddleware("student"), leaveGroup);

export default router;
