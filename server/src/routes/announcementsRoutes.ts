import { Router } from "express";
import {
  getAnnouncements,
  createAnnouncement,
} from "../controllers/announcementsController";

const router = Router();

router.get("/announcements", getAnnouncements);
router.post("/announcements", createAnnouncement); // 新しいエンドポイントを追加

export default router;
