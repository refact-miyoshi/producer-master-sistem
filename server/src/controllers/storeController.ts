// storeController.ts
import { Request, Response } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "3306", 10),
});

interface SalesRow extends RowDataPacket {
  total: number;
}

interface MonthSalesRow extends RowDataPacket {
  month: string;
  total: number;
}

export const getSalesData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const storeId = req.params.storeId;

    const [thisMonthRows] = await dbConnection.query<SalesRow[]>(
      `SELECT SUM(revenue) as total FROM store_sales WHERE store_id = ? AND MONTH(month) = ?`,
      [storeId, new Date().getMonth() + 1] // 現在の月を取得
    );

    const [lastThreeMonthsRows] = await dbConnection.query<MonthSalesRow[]>(
      `SELECT DATE_FORMAT(month, '%Y-%m') as month, SUM(revenue) as total FROM store_sales WHERE store_id = ? AND month >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH) GROUP BY DATE_FORMAT(month, '%Y-%m')`,
      [storeId]
    );

    if (!thisMonthRows || !lastThreeMonthsRows) {
      throw new Error("クエリの実行に失敗しました");
    }

    const salesData = {
      thisMonth: thisMonthRows[0]?.total || 0,
      lastThreeMonths: lastThreeMonthsRows,
    };

    return res.status(200).json(salesData);
  } catch (error: any) {
    return res.status(500).json({
      message: "売上データの取得に失敗しました",
      error: error.message,
    });
  }
};
