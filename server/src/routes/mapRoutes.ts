import { Router } from "express";
import {
  getMapPoints,
  addMapPoint,
  updateMapPoint,
  deleteMapPoint,
} from "../controllers/mapController";

const router = Router();

router.get("/map-points", getMapPoints);
router.post("/map-points", addMapPoint);
router.put("/map-points/:id", updateMapPoint);
router.delete("/map-points/:id", deleteMapPoint);

export default router;
