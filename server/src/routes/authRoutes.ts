import { Router } from "express";
import { login } from "../controllers/authController"; // ルートが正しいことを確認

const router = Router();

router.post("/login", login);

export default router;
