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

export const getProducers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { search } = req.query; // クエリパラメータから検索条件を取得
  let query = "SELECT * FROM producers";
  const queryParams: any[] = [];

  if (search) {
    query += " WHERE name LIKE ? OR region LIKE ?";
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  try {
    const [rows] = await dbConnection.query<RowDataPacket[]>(
      query,
      queryParams
    );
    return res.status(200).json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getProducerById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  try {
    const [rows] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM producers WHERE id = ?",
      [id]
    );
    const producer = rows[0];
    if (!producer) {
      return res.status(404).json({ error: "Producer not found" });
    }
    return res.status(200).json(producer);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const addProducer = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, email, productType, region, sales } = req.body;
  try {
    const [result]: any = await dbConnection.query(
      "INSERT INTO producers (name, email, productType, region, sales) VALUES (?, ?, ?, ?, ?)",
      [name, email, productType, region, sales]
    );
    return res
      .status(201)
      .json({ id: result.insertId, name, email, productType, region, sales });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProducer = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { name, email, productType, region, sales } = req.body;
  try {
    await dbConnection.query(
      "UPDATE producers SET name = ?, email = ?, productType = ?, region = ?, sales = ? WHERE id = ?",
      [name, email, productType, region, sales, id]
    );
    return res
      .status(200)
      .json({ id, name, email, productType, region, sales });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProducer = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  try {
    await dbConnection.query("DELETE FROM producers WHERE id = ?", [id]);
    return res.status(200).json({ message: "Producer deleted" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
