import express from "express";
import {
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  createAnnouncement, // 新しい関数をインポート
} from "../controllers/noticesController";

const router = express.Router();

// すべてのお知らせを取得するエンドポイント
router.get("/notices", getAllAnnouncements);

// 特定のお知らせを取得するエンドポイント
router.get("/notices/:id", getAnnouncementById);

// 新しいお知らせを作成するエンドポイント
router.post("/notices", createAnnouncement); // 新規作成用のルートを追加

// 特定のお知らせを更新するエンドポイント
router.put("/notices/:id", updateAnnouncement);

// 特定のお知らせを削除するエンドポイント
router.delete("/notices/:id", deleteAnnouncement);

export default router;
