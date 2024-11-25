import { Request, Response } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";

import bcrypt from "bcryptjs";

// データベース接続
const dbConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "3306", 10),
});

// 全ユーザーを取得するエンドポイント
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM users"
    );

    // userType を配列に変換（カンマ区切りで保存されている場合を想定）
    const users = rows.map((user) => ({
      ...user,
      userType: user.userType.split(","), // カンマで分割して配列化
    }));

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// 特定のユーザーを取得するエンドポイント
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const [rows] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// 新しいユーザーを作成するエンドポイント
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password, userType, notes } = req.body;

  try {
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10); // ソルトラウンドを10に設定

    // userTypeをカンマ区切り文字列に変換
    const userTypeString = Array.isArray(userType)
      ? userType.join(",")
      : userType;

    // データベースにユーザーを挿入
    const [result] = await dbConnection.query(
      "INSERT INTO users (username, password, userType, notes) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, userTypeString, notes || null]
    );

    res.status(201).json({
      message: "User created successfully",
      userId: (result as any).insertId,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating user:", error.message);
      res
        .status(500)
        .json({ error: "Failed to create user", details: error.message });
    } else {
      console.error("Error creating user:", error);
      res
        .status(500)
        .json({ error: "Failed to create user", details: "Unknown error" });
    }
  }
};

// ユーザーを更新するエンドポイント
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { username, password, userType, notes } = req.body;

  try {
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // userTypeをカンマ区切り文字列に変換
    const userTypeString = Array.isArray(userType)
      ? userType.join(",")
      : userType;

    // データベースでユーザーを更新
    const [result] = await dbConnection.query(
      "UPDATE users SET username = ?, password = ?, userType = ?, notes = ? WHERE id = ?",
      [username, hashedPassword, userTypeString, notes || null, id]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json({ message: "User updated successfully" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// ユーザーを削除するエンドポイント
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const [result] = await dbConnection.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
