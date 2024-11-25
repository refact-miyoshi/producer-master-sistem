import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import cors from "cors";

// ルートのインポート
import authRoutes from "./routes/authRoutes";
import salesRoutes from "./routes/salesRoutes";
import producerRoutes from "./routes/producerRoutes";
import mapRoutes from "./routes/mapRoutes";
import performanceRoutes from "./routes/performanceRoutes";
import activityRoutes from "./routes/activityRoutes";
import salesDocsRoutes from "./routes/salesDocsRoutes";
import noticesRoutes from "./routes/noticesRoutes";
import pinsRoutes from "./routes/pinsRoutes";
import karuteRoutes from "./routes/karuteRoutes";
import producerChartRoutes from "./routes/producerChartRoutes";
import storeRoutes from "./routes/storeRoutes";
import userRoute from "./routes/userRoute";
import producerPerformanceRoutes from "./routes/producerPerformanceRoutes";

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
  waitForConnections: true, // コネクションプールがいっぱいになると待機
  connectionLimit: 10, // 最大同時接続数
  queueLimit: 0, // 待機できるリクエストの数 (0は無制限)
});

const corsOptions = {
  origin: "*", // 必要に応じて特定のドメインに制限
  methods: ["GET", "POST", "PUT", "DELETE"], // 許可するHTTPメソッド
  allowedHeaders: ["Content-Type", "Authorization"], // 許可するヘッダー
};

app.use(cors(corsOptions)); // corsを使用する

// APIルート設定
// サーバーコード内のルート設定
app.use("/api", authRoutes);
app.use("/api/store", storeRoutes);
app.use("/api", salesRoutes);
app.use("/api", producerRoutes); // ルートを正しく登録
app.use("/api", mapRoutes);
app.use("/api", noticesRoutes);
app.use("/api", performanceRoutes);
app.use("/api", activityRoutes);
app.use("/api", salesDocsRoutes);
app.use("/api", pinsRoutes);
app.use("/api", karuteRoutes);
app.use("/api", userRoute);
// `/api/producer-performance` でルートを登録
app.use("/api/producer-performance", producerPerformanceRoutes);

// 他のミドルウェアとルートの設定の後に追加
app.use("/api/producer_chart", producerChartRoutes);

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});
