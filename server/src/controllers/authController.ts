import dotenv from "dotenv";
dotenv.config(); // 環境変数を読み込むためにdotenvを設定します

import { Request, Response } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// MySQLデータベースとの接続プールを作成します
const dbConnection = mysql.createPool({
  host: process.env.DB_HOST as string, // データベースホスト
  user: process.env.DB_USER as string, // データベースユーザー
  password: process.env.DB_PASSWORD as string, // データベースパスワード
  database: process.env.DB_NAME as string, // 使用するデータベース名
  port: parseInt(process.env.DB_PORT as string, 10), // データベースポート
});

// RowDataPacketを拡張してユーザーのプロパティを追加します
interface User extends RowDataPacket {
  id: number; // ユーザーのID
  username: string; // ユーザー名
  password: string; // ハッシュ化されたパスワード
  userType: string; // ユーザータイプ（admin, sales, storeなど）
}

// ログイン処理の関数を定義します
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body; // リクエストボディからユーザー名とパスワードを取得

  try {
    // データベース接続のテストを行います
    await dbConnection.getConnection();

    // ユーザー名でユーザーを検索します
    const [rows] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      console.error(`ユーザー名 "${username}" が見つかりません`);
      return res.status(401).json({ message: "無効な資格情報" });
    }
    const user = rows[0];

    // パスワード比較
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("パスワードが一致しません");
      return res.status(401).json({ message: "無効な資格情報" });
    }

    // JWTトークンを生成します
    const token = jwt.sign(
      { id: user.id, userType: user.userType }, // トークンに含めるペイロード
      process.env.JWT_SECRET as string, // JWTの秘密鍵
      { expiresIn: "1h" } // トークンの有効期限を1時間に設定
    );

    // ログイン成功時にトークンとユーザータイプを返します
    res.json({ token, userType: user.userType });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("ログイン処理中のエラー:", error.message); // エラーメッセージをログに出力
      res.status(500).json({ message: "サーバーエラー", error: error.message }); // サーバーエラーを返す
    } else {
      console.error("ログイン処理中のエラー:", error); // その他のエラータイプをログに出力
      res
        .status(500)
        .json({ message: "サーバーエラー", error: "不明なエラー" }); // 不明なエラーを返す
    }
  }
};
