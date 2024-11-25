import { Router } from "express";
import {
  createProducerChart,
  getProducerChartByProducerId,
} from "../controllers/producerChartController";

const router = Router();

// カルテ作成エンドポイント
router.post("/", createProducerChart);

// 特定のプロデューサーのカルテ取得エンドポイント
router.get("/:producerId", getProducerChartByProducerId);

export default router;
