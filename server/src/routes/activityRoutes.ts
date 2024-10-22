import { Router } from "express";
import {
  getActivities,
  getActivityById,
  addActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController";

const router = Router();

router.get("/activities", getActivities);
router.get("/activities/:id", getActivityById); // 新しいエンドポイントを追加
router.post("/activities", addActivity);
router.put("/activities/:id", updateActivity);
router.delete("/activities/:id", deleteActivity);

export default router;
