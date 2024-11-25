import express from "express";
import {
  createProducerPerformance,
  getProducerPerformanceByProducerId,
  deleteProducerPerformance,
} from "../controllers/producerPerformanceController";

const router = express.Router();

// 実績データを作成
router.post("/", createProducerPerformance);

// 特定のプロデューサーの実績データを取得
router.get("/:producerId", getProducerPerformanceByProducerId);

// 特定の実績データを削除
router.delete("/:id", deleteProducerPerformance);

export default router;
