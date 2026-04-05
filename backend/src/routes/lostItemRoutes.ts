import { Router } from "express";
import { createLostItem, listLostItems, updateLostItem } from "../controllers/lostItemController.js";
import { authMiddleware } from "../middleware/auth.js";
import { facultyMiddleware } from "../middleware/faculty.js";

const router = Router();

router.get("/", authMiddleware, facultyMiddleware(), listLostItems);
router.post("/", authMiddleware, facultyMiddleware({ allowOverride: true }), createLostItem);
router.patch("/:id", authMiddleware, facultyMiddleware(), updateLostItem);

export default router;
