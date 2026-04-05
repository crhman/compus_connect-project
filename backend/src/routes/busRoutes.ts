import { Router } from "express";
import { createBus, deleteBus, listBuses, updateBus } from "../controllers/busController.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/role.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("admin"), listBuses);
router.post("/", authMiddleware, roleMiddleware("admin"), createBus);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateBus);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteBus);

export default router;
