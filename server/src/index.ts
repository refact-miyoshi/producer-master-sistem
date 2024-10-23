import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import cors from "cors";

// ルートのインポート
import authRoutes from "./routes/authRoutes";
import producerRoutes from "./routes/producerRoutes";
import mapRoutes from "./routes/mapRoutes";
import performanceRoutes from "./routes/performanceRoutes";
import activityRoutes from "./routes/activityRoutes";
import salesDocsRoutes from "./routes/salesDocsRoutes";
import announcementsRoutes from "./routes/announcementsRoutes";
import pinsRoutes from "./routes/pinsRoutes";
import karuteRoutes from "./routes/karuteRoutes";

dotenv.config(); // 最初に呼び出す
const app = express();
const PORT = process.env.PORT || 3001; // 環境変数からポートを取得

app.use(cors());
app.use(bodyParser.json());

const dbConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  charset: "utf8mb4",
});

// APIルート設定
app.use("/api/auth", authRoutes);
app.use("/api", producerRoutes);
app.use("/api", mapRoutes);
app.use("/api", announcementsRoutes);
app.use("/api", performanceRoutes);
app.use("/api", activityRoutes);
app.use("/api", salesDocsRoutes);
app.use("/api", pinsRoutes);
app.use("/api", karuteRoutes);

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});

// データベース接続確認とエラーハンドリング（不要なら削除可）
dbConnection
  .query("SELECT 1")
  .then(() => {
    console.log("データベース接続成功");
  })
  .catch((error) => {
    console.error("データベース接続エラー:", error);
  });
