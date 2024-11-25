// routes/salesRoutes.ts

import { Router } from "express";
import {
  getSalesProgress,
  getCurrentMonthSales,
} from "../controllers/salesController";

const router = Router();

// 今年度の営業成績進捗
router.get("/sales/progress", getSalesProgress);

// 今月の営業成績
router.get("/sales/current-month", getCurrentMonthSales);

export default router;
