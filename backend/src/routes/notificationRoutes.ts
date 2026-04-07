import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getUnreadCount, listNotifications, markAsRead } from "../controllers/notificationController.js";

const router = Router();

router.get("/", authMiddleware, listNotifications);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.post("/read-all", authMiddleware, markAsRead);

export default router;
