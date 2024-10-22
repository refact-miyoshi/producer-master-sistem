import { Router } from "express";
import { getPins, createPin } from "../controllers/pinsController";

const router = Router();

router.get("/pins", getPins);
router.post("/pins", createPin);

export default router;
