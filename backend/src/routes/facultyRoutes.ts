import { Router } from "express";
import { createFaculty, deleteFaculty, listFaculties, updateFaculty } from "../controllers/facultyController.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/role.js";

const router = Router();

router.get("/", listFaculties);
router.post("/", authMiddleware, roleMiddleware("admin"), createFaculty);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateFaculty);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteFaculty);

export default router;
