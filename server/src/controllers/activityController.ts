import { Request, Response } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";

// MySQLデータベースとの接続を作成
const dbConnection = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: parseInt(process.env.DB_PORT as string, 10),
});

// 全てのアクティビティを取得する関数
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

// IDを指定して特定のアクティビティを取得する関数
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

// 新しいアクティビティを追加する関数
export const addActivity = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    activity_name,
    contact_date,
    sales_person,
    client_name,
    contact_method,
    negotiation_content,
    angle_impression,
    remarks,
    next_meeting_date,
    next_meeting_comment,
  } = req.body;

  try {
    const [result]: any = await dbConnection.query(
      `INSERT INTO activities (
        activity_name, contact_date, sales_person, client_name, 
        contact_method, negotiation_content, angle_impression, 
        remarks, next_meeting_date, next_meeting_comment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        activity_name,
        contact_date,
        sales_person,
        client_name,
        contact_method,
        negotiation_content,
        angle_impression,
        remarks,
        next_meeting_date,
        next_meeting_comment,
      ]
    );

    return res.status(201).json({
      id: result.insertId,
      activity_name,
      contact_date,
      sales_person,
      client_name,
      contact_method,
      negotiation_content,
      angle_impression,
      remarks,
      next_meeting_date,
      next_meeting_comment,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// 特定のアクティビティを更新する関数
export const updateActivity = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const {
    activity_name,
    contact_date,
    sales_person,
    client_name,
    contact_method,
    negotiation_content,
    angle_impression,
    remarks,
    next_meeting_date,
    next_meeting_comment,
  } = req.body;

  try {
    await dbConnection.query(
      `UPDATE activities SET 
        activity_name = ?, contact_date = ?, sales_person = ?, 
        client_name = ?, contact_method = ?, negotiation_content = ?, 
        angle_impression = ?, remarks = ?, next_meeting_date = ?, 
        next_meeting_comment = ? 
      WHERE id = ?`,
      [
        activity_name,
        contact_date,
        sales_person,
        client_name,
        contact_method,
        negotiation_content,
        angle_impression,
        remarks,
        next_meeting_date,
        next_meeting_comment,
        id,
      ]
    );

    return res.status(200).json({
      id,
      activity_name,
      contact_date,
      sales_person,
      client_name,
      contact_method,
      negotiation_content,
      angle_impression,
      remarks,
      next_meeting_date,
      next_meeting_comment,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// 特定のアクティビティを削除する関数
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
