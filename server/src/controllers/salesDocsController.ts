import { Request, Response } from "express";
import mysql from "mysql2/promise";
import multer from "multer";
import path from "path";
import sanitize from "sanitize-filename"; // ファイル名を安全に保つために使用

const dbConnection = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: parseInt(process.env.DB_PORT as string, 10),
});

// multer設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ファイルの保存先ディレクトリ
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = sanitize(file.originalname); // サニタイズしたファイル名を使う
    cb(null, `${Date.now()}-${sanitizedFilename}`);
  },
});

const upload = multer({ storage });

export const getSalesDocuments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const [documents] = await dbConnection.query(
      "SELECT * FROM sales_documents"
    );
    return res.status(200).json(documents);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const uploadSalesDocument = [
  upload.single("file"),
  async (req: Request, res: Response): Promise<Response> => {
    const { filename } = req.file!;
    const originalname = Buffer.from(req.file!.originalname, "binary").toString(
      "utf-8"
    );
    const uploadedBy = req.body.uploadedBy;
    const uploadDate = new Date();

    try {
      const [result]: any = await dbConnection.query(
        "INSERT INTO sales_documents (title, url, uploadDate, uploadedBy) VALUES (?, ?, ?, ?)",
        [originalname, path.join("uploads/", filename), uploadDate, uploadedBy]
      );
      return res.status(201).json({
        id: result.insertId,
        title: originalname,
        url: path.join("uploads/", filename),
        uploadDate,
        uploadedBy,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },
];

export const addSalesDocument = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, url, uploadedBy } = req.body;
  const uploadDate = new Date();

  try {
    const [result]: any = await dbConnection.query(
      "INSERT INTO sales_documents (title, url, uploadDate, uploadedBy) VALUES (?, ?, ?, ?)",
      [title, url, uploadDate, uploadedBy]
    );
    return res
      .status(201)
      .json({ id: result.insertId, title, url, uploadDate, uploadedBy });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateSalesDocument = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { title, url, uploadedBy } = req.body;
  const uploadDate = new Date();

  try {
    await dbConnection.query(
      "UPDATE sales_documents SET title = ?, url = ?, uploadDate = ?, uploadedBy = ? WHERE id = ?",
      [title, url, uploadDate, uploadedBy, id]
    );
    return res.status(200).json({ id, title, url, uploadDate, uploadedBy });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteSalesDocument = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    await dbConnection.query("DELETE FROM sales_documents WHERE id = ?", [id]);
    return res.status(200).json({ message: "Document deleted" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
