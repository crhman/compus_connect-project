import { Router } from "express";
import { createLostItem, listLostItems, updateLostItem } from "../controllers/lostItemController.js";
import { authMiddleware } from "../middleware/auth.js";
import { facultyMiddleware } from "../middleware/faculty.js";
import { upload } from "../middleware/upload.js";
import { roleMiddleware } from "../middleware/role.js";

const router = Router();

router.get("/", authMiddleware, facultyMiddleware(), listLostItems);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  facultyMiddleware({ allowOverride: true }),
  upload.single("image"),
  createLostItem
);
router.patch("/:id", authMiddleware, facultyMiddleware(), upload.single("image"), updateLostItem);

export default router;
