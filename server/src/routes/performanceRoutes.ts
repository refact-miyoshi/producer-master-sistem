import { Router } from "express";
import {
  getPerformanceByProductType,
  getPerformanceByRegion,
  getPerformanceYearOverYear,
} from "../controllers/performanceController";

const router = Router();

router.get("/performance/product-type", getPerformanceByProductType);
router.get("/performance/region", getPerformanceByRegion);
router.get("/performance/year-over-year", getPerformanceYearOverYear);

export default router;
