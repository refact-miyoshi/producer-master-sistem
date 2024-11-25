import { Request, Response } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConnection = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: parseInt(process.env.DB_PORT as string, 10),
});

// 実績データを作成する
export const createProducerPerformance = async (
  req: Request,
  res: Response
) => {
  try {
    const { producer_id, date, store, item, sales, previous_year_sales } =
      req.body;

    const [result]: any = await dbConnection.query(
      `INSERT INTO Performance (
         producer_id, date, store, item, sales, previous_year_sales
       ) VALUES (?, ?, ?, ?, ?, ?)`,
      [producer_id, date, store, item, sales, previous_year_sales]
    );

    return res
      .status(201)
      .json({ message: "実績データが作成されました", id: result.insertId });
  } catch (error: any) {
    console.error("Error creating producer performance: ", error.message);
    return res.status(500).json({
      error: "実績データの作成中にエラーが発生しました。",
    });
  }
};

// 特定のプロデューサーの実績データを取得する
export const getProducerPerformanceByProducerId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { producerId } = req.params;
  try {
    const [rows] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM Performance WHERE producer_id = ? ORDER BY date DESC",
      [producerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "実績データが見つかりません" });
    }

    return res.status(200).json(rows);
  } catch (error: any) {
    console.error("Error fetching producer performance: ", error.message);
    return res.status(500).json({
      error: "実績データの取得中にエラーが発生しました。",
    });
  }
};

// 実績データを削除する
export const deleteProducerPerformance = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const [result]: any = await dbConnection.query(
      "DELETE FROM Performance WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "削除対象の実績データが見つかりません" });
    }

    return res.status(200).json({ message: "実績データが削除されました" });
  } catch (error: any) {
    console.error("Error deleting producer performance: ", error.message);
    return res.status(500).json({
      error: "実績データの削除中にエラーが発生しました。",
    });
  }
};
