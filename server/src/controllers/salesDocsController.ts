import { Request, Response } from "express";
import mysql from "mysql2/promise";
import multer from "multer";
import path from "path";
import sanitize from "sanitize-filename"; // ファイル名を安全に保つためのライブラリ

// データベース接続の設定
const dbConnection = mysql.createPool({
  host: process.env.DB_HOST as string, // データベースホスト
  user: process.env.DB_USER as string, // データベースユーザー名
  password: process.env.DB_PASSWORD as string, // データベースパスワード
  database: process.env.DB_NAME as string, // データベース名
  port: parseInt(process.env.DB_PORT as string, 10), // データベースポート
});

// multerの設定：アップロードされたファイルの保存先とファイル名を定義
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ファイルを保存するディレクトリ
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = sanitize(file.originalname); // ファイル名をサニタイズ
    cb(null, `${Date.now()}-${sanitizedFilename}`); // タイムスタンプで一意のファイル名を生成
  },
});

const upload = multer({ storage }); // multerのインスタンスを作成

// セールスドキュメントのリストを取得する関数
export const getSalesDocuments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // sales_documentsテーブルからすべてのドキュメントを取得
    const [documents] = await dbConnection.query(
      "SELECT * FROM sales_documents"
    );
    // ステータスコード200でドキュメントをJSON形式で返す
    return res.status(200).json(documents);
  } catch (error: any) {
    // エラー発生時：ステータスコード500でエラーメッセージを返す
    return res.status(500).json({ error: error.message });
  }
};

// セールスドキュメントをアップロードする関数
export const uploadSalesDocument = [
  upload.single("file"), // multerで単一ファイルをアップロード
  async (req: Request, res: Response): Promise<Response> => {
    const { filename } = req.file!;
    const originalname = Buffer.from(req.file!.originalname, "binary").toString(
      "utf-8"
    );
    const uploadedBy = req.body.uploadedBy;
    const tags = req.body.tags || ""; // タグ情報を受け取る
    const uploadDate = new Date();

    try {
      const [result]: any = await dbConnection.query(
        "INSERT INTO sales_documents (title, url, uploadDate, uploadedBy, tags) VALUES (?, ?, ?, ?, ?)",
        [
          originalname,
          path.join("uploads/", filename),
          uploadDate,
          uploadedBy,
          tags,
        ]
      );
      return res.status(201).json({
        id: result.insertId,
        title: originalname,
        url: path.join("uploads/", filename),
        uploadDate,
        uploadedBy,
        tags,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },
];

// セールスドキュメントを手動で追加する関数
export const addSalesDocument = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, url, uploadedBy, tags } = req.body;
  const uploadDate = new Date();

  try {
    const [result]: any = await dbConnection.query(
      "INSERT INTO sales_documents (title, url, uploadDate, uploadedBy, tags) VALUES (?, ?, ?, ?, ?)",
      [title, url, uploadDate, uploadedBy, tags]
    );
    return res
      .status(201)
      .json({ id: result.insertId, title, url, uploadDate, uploadedBy, tags });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// セールスドキュメント情報を更新する関数
export const updateSalesDocument = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { title, url, uploadedBy, tags } = req.body;
  const uploadDate = new Date();

  try {
    await dbConnection.query(
      "UPDATE sales_documents SET title = ?, url = ?, uploadDate = ?, uploadedBy = ?, tags = ? WHERE id = ?",
      [title, url, uploadDate, uploadedBy, tags, id]
    );
    return res
      .status(200)
      .json({ id, title, url, uploadDate, uploadedBy, tags });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// セールスドキュメントを削除する関数
export const deleteSalesDocument = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params; // 削除するドキュメントのID

  try {
    // 指定されたIDのドキュメントを削除
    await dbConnection.query("DELETE FROM sales_documents WHERE id = ?", [id]);
    // ステータスコード200で削除成功メッセージを返す
    return res.status(200).json({ message: "Document deleted" });
  } catch (error: any) {
    // エラー発生時：ステータスコード500でエラーメッセージを返す
    return res.status(500).json({ error: error.message });
  }
};
