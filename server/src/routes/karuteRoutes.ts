import express from "express";
import { createProducerRecord } from "../controllers/karuteController";

const router = express.Router();

// POSTリクエストでカルテを作成するエンドポイント
router.post("/chart", createProducerRecord);

export default router;
