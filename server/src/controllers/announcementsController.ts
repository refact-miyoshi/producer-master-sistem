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

export const getAnnouncements = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const [rows] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM announcements"
    );
    return res.status(200).json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createAnnouncement = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, detail } = req.body;
  const date = new Date().toISOString().slice(0, 10); // 現在の日付を取得

  try {
    const [result]: any = await dbConnection.query(
      "INSERT INTO announcements (title, date, detail) VALUES (?, ?, ?)",
      [title, date, detail]
    );
    return res.status(201).json({ id: result.insertId, title, date, detail });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
