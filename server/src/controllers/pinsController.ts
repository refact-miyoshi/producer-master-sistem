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

export const getPins = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const [rows] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM map_pins"
    );
    return res.status(200).json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createPin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { lat, lng, color, person_in_charge, status, details } = req.body;
  try {
    const [result]: any = await dbConnection.query(
      "INSERT INTO map_pins (lat, lng, color, person_in_charge, status, details) VALUES (?, ?, ?, ?, ?, ?)",
      [lat, lng, color, person_in_charge, status, details]
    );
    return res.status(201).json({
      id: result.insertId,
      lat,
      lng,
      color,
      person_in_charge,
      status,
      details,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
