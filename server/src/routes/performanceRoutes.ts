import { Router } from "express";
import { getPerformanceData } from "../controllers/performanceController";

const router = Router();

router.get("/performance", getPerformanceData);

export default router;
