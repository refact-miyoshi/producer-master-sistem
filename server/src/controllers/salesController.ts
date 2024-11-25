import { Request, Response } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";

// MySQL接続
const dbConnection = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: parseInt(process.env.DB_PORT as string, 10),
});

// 営業成績進捗を取得するAPIエンドポイント
export const getSalesProgress = async (req: Request, res: Response) => {
  try {
    // データベースから営業成績データを取得
    const [rows] = await dbConnection.execute<RowDataPacket[]>(
      `SELECT month, sales, target FROM sales_progress ORDER BY month`
    );

    // データが存在するか確認
    if (!rows.length) {
      return res
        .status(404)
        .json({ message: "営業成績データが見つかりませんでした。" });
    }

    // データをレスポンスとして返す
    res.json(rows);
  } catch (error) {
    console.error("営業成績データの取得に失敗しました", error);
    res.status(500).json({ message: "営業成績データの取得に失敗しました。" });
  }
};
// 今月の営業成績を取得するエンドポイント
export const getCurrentMonthSales = async (req: Request, res: Response) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"形式

    const [rows] = await dbConnection.execute<RowDataPacket[]>(
      `SELECT SUM(sales) AS sales, target FROM sales_progress WHERE month LIKE ? GROUP BY target`,
      [`${currentMonth}%`]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "今月の営業成績データが見つかりませんでした。" });
    }

    const { sales, target } = rows[0];
    res.json({ sales, target });
  } catch (error) {
    console.error("今月の営業成績データの取得に失敗しました", error);
    res
      .status(500)
      .json({ message: "今月の営業成績データの取得に失敗しました。" });
  }
};
