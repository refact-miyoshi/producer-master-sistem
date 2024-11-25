import { Request, Response } from "express";
import mysql from "mysql2/promise";

// MySQLデータベース接続プール
const dbConnection = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: parseInt(process.env.DB_PORT as string, 10),
});

// 売上データを取得する関数
export const getPerformanceData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const [results] = await dbConnection.query(`
      SELECT 
        id AS id, -- idをproducerIdとして取得
        productType, 
        name, 
        region, 
        SUM(sales) as totalSales
      FROM producers
      GROUP BY id, productType, name, region
    `);
    return res.status(200).json(results);
  } catch (error: any) {
    console.error("売上データ取得エラー:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
