// storeRoutes.ts
import { Router } from "express";
import { getSalesData } from "../controllers/storeController";

const router = Router();

// 売上データ取得のルート
router.get("/sales/:storeId", getSalesData);

export default router;
