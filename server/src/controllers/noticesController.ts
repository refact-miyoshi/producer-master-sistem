import { Request, Response } from "express"; // Expressのリクエストとレスポンス型をインポート
import mysql, { RowDataPacket } from "mysql2/promise"; // MySQL2をPromiseで使用
import dotenv from "dotenv"; // 環境変数の設定を読み込むdotenv

dotenv.config(); // .envファイルから環境変数をロード

// データベース接続設定
const dbConnection = mysql.createPool({
  host: process.env.DB_HOST as string, // DBホスト名（環境変数から取得）
  user: process.env.DB_USER as string, // DBユーザー名
  password: process.env.DB_PASSWORD as string, // DBパスワード
  database: process.env.DB_NAME as string, // データベース名
  port: parseInt(process.env.DB_PORT as string, 10), // ポート番号を整数に変換して設定
});

// お知らせ一覧を取得する関数
export const getAllAnnouncements = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const [rows] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM announcements"
    );
    // データがなくても、空の配列を返す
    return res.status(200).json(rows);
  } catch (error: any) {
    console.error("Error fetching announcements:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// お知らせをIDで取得する関数
export const getAnnouncementById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params; // パラメータからIDを取得
  try {
    const [rows] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM announcements WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "お知らせが見つかりません。" });
    }

    return res.status(200).json(rows[0]); // 該当するお知らせを返す
  } catch (error: any) {
    console.error("Error fetching announcement by ID:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// お知らせを更新する関数
export const updateAnnouncement = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params; // パラメータからIDを取得
  const { title, detail } = req.body; // 更新データを取得

  try {
    const [result]: any = await dbConnection.query(
      "UPDATE announcements SET title = ?, detail = ? WHERE id = ?",
      [title, detail, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "お知らせが見つかりません。" });
    }

    return res.status(200).json({ id, title, detail }); // 更新されたデータを返す
  } catch (error: any) {
    console.error("Error updating announcement:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// お知らせを削除する関数
export const deleteAnnouncement = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params; // パラメータからIDを取得

  try {
    const [result]: any = await dbConnection.query(
      "DELETE FROM announcements WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "お知らせが見つかりません。" });
    }

    return res.status(200).json({ message: "お知らせを削除しました。" });
  } catch (error: any) {
    console.error("Error deleting announcement:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// 新しいお知らせを作成する関数
export const createAnnouncement = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, content, importance, region, productType } = req.body; // リクエストボディからデータを取得

  const currentDate = new Date();

  try {
    // データベースに新しいお知らせを挿入
    const [result]: any = await dbConnection.query(
      `INSERT INTO announcements (title, content, importance, region, productType, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        content,
        importance,
        JSON.stringify(region), // 配列をJSON文字列に変換して保存
        JSON.stringify(productType), // 配列をJSON文字列に変換して保存
        currentDate,
        currentDate,
      ]
    );

    // 挿入した新しいお知らせの ID を取得
    const newAnnouncementId = result.insertId;

    return res.status(201).json({
      id: newAnnouncementId,
      title,
      content,
      importance,
      region,
      productType,
      created_at: currentDate,
      updated_at: currentDate,
      message: "新しいお知らせが作成されました。",
    });
  } catch (error: any) {
    console.error("Error creating announcement:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
