import { Request, Response } from "express";
import mysql from "mysql2/promise";

const dbConnection = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: parseInt(process.env.DB_PORT as string, 10),
});

export const getPerformanceByProductType = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const [results] = await dbConnection.query(`
            SELECT productType, name, SUM(sales) as totalSales
            FROM producers
            GROUP BY productType, name
        `);
    return res.status(200).json(results);
  } catch (error: any) {
    console.error("品目ごとの売上データ取得エラー:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const getPerformanceByRegion = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const [results] = await dbConnection.query(`
            SELECT region, name, SUM(sales) as totalSales
            FROM producers
            GROUP BY region, name
        `);
    return res.status(200).json(results);
  } catch (error: any) {
    console.error("地域ごとの売上データ取得エラー:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const getPerformanceYearOverYear = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const [results] = await dbConnection.query(`
            SELECT 
                YEAR(date) as year, 
                name, 
                SUM(sales) as totalSales 
            FROM producers 
            WHERE date BETWEEN CURDATE() - INTERVAL 1 YEAR AND CURDATE()
            GROUP BY YEAR(date), name
        `);
    return res.status(200).json(results);
  } catch (error: any) {
    console.error("昨年比の売上データ取得エラー:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
