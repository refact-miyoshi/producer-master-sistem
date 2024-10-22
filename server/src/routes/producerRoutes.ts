import { Router } from "express";
import {
  getProducers,
  getProducerById,
  addProducer,
  updateProducer,
  deleteProducer,
} from "../controllers/producerController";

const router = Router();

router.get("/producers", getProducers);
router.get("/producers/:id", getProducerById); // 新しいエンドポイントを追加
router.post("/producers", addProducer);
router.put("/producers/:id", updateProducer);
router.delete("/producers/:id", deleteProducer);

export default router;
