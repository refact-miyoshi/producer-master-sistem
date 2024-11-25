import { Router } from "express";
import {
  getProducers,
  getProducerById,
  addProducer,
  updateProducer,
  deleteProducer,
  searchProducers, // 検索エンドポイントのインポート
} from "../controllers/producerController";

const router = Router();

router.get("/producers", getProducers);
router.get("/producers/:id", getProducerById);
router.post("/producers", addProducer);
router.put("/producers/:id", updateProducer);
router.delete("/producers/:id", deleteProducer);
router.get("/producers/search", searchProducers); // 検索エンドポイントの追加
export default router;
