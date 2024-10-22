import { Request, Response } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";

const dbConnection = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: parseInt(process.env.DB_PORT as string, 10),
});

export const getActivities = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const [activities] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM activities"
    );
    return res.status(200).json(activities);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getActivityById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  try {
    const [activities] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM activities WHERE id = ?",
      [id]
    );
    const activity = activities[0];
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    return res.status(200).json(activity);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const addActivity = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, date, client, method, details } = req.body;
  try {
    const [result]: any = await dbConnection.query(
      "INSERT INTO activities (name, date, client, method, details) VALUES (?, ?, ?, ?, ?)",
      [name, date, client, method, details]
    );
    return res
      .status(201)
      .json({ id: result.insertId, name, date, client, method, details });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateActivity = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { name, date, client, method, details } = req.body;
  try {
    await dbConnection.query(
      "UPDATE activities SET name = ?, date = ?, client = ?, method = ?, details = ? WHERE id = ?",
      [name, date, client, method, details, id]
    );
    return res.status(200).json({ id, name, date, client, method, details });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteActivity = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  try {
    await dbConnection.query("DELETE FROM activities WHERE id = ?", [id]);
    return res.status(200).json({ message: "Activity deleted" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
