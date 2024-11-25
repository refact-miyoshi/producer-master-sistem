import { Request, Response } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv"; // データベース接続をインポート

// 環境変数を読み込むための設定
dotenv.config();

// MySQLデータベースへの接続プールを作成
const dbConnection = mysql.createPool({
  host: process.env.DB_HOST as string, // データベースのホスト
  user: process.env.DB_USER as string, // データベースのユーザー名
  password: process.env.DB_PASSWORD as string, // データベースのパスワード
  database: process.env.DB_NAME as string, // データベースの名前
  port: parseInt(process.env.DB_PORT as string, 10), // データベースのポート
});

// カルテを作成する関数

export const createProducerChart = async (req: Request, res: Response) => {
  try {
    // リクエストデータの構造を確認
    console.log("Request body:", req.body);

    // チェックボックス項目のnull許容
    const successorExists = req.body.successor_exists ?? null;
    const pesticideUsage = req.body.pesticide_usage ?? null;

    // SQLクエリの実行
    const [result]: any = await dbConnection.query(
      `INSERT INTO producer_chart (
            producer_id, birth_date, health_status, address, business_type,
            rice_field_area, crop_field_area, orchard_area, main_product,
            tel, mobile, fax, farming_years, sustainable_years,
            successor_exists, employee_count, farm_address1, farm_address2,
            farm_address3, farm_address4, delivery_method, raw_material_supplier,
            pesticide_usage, annual_sales_amount, every_sales_amount,
            annual_schedule, requests_to_every, other_clients, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.producer_id ?? null,
        req.body.birth_date ?? null,
        req.body.health_status ?? null,
        req.body.address ?? null,
        req.body.business_type ?? null,
        req.body.rice_field_area ?? null,
        req.body.crop_field_area ?? null,
        req.body.orchard_area ?? null,
        req.body.main_product ?? null,
        req.body.tel ?? null,
        req.body.mobile ?? null,
        req.body.fax ?? null,
        req.body.farming_years ?? null,
        req.body.sustainable_years ?? null,
        successorExists,
        req.body.employee_count ?? null,
        req.body.farm_address1 ?? null,
        req.body.farm_address2 ?? null,
        req.body.farm_address3 ?? null,
        req.body.farm_address4 ?? null,
        req.body.delivery_method ?? null,
        req.body.raw_material_supplier ?? null,
        pesticideUsage,
        req.body.annual_sales_amount ?? null,
        req.body.every_sales_amount ?? null,
        req.body.annual_schedule ?? null,
        req.body.requests_to_every ?? null,
        req.body.other_clients ?? null,
        req.body.notes ?? null,
      ]
    );

    return res
      .status(201)
      .json({ message: "カルテが作成されました", id: result.insertId });
  } catch (error: any) {
    // エラー詳細を確認するために、エラーメッセージとスタックトレースを出力
    console.error("Error creating producer chart: ", error.message);
    console.error("Stack trace: ", error.stack);
    console.error("Request body:", req.body); // リクエストのデータをログ出力

    return res
      .status(500)
      .json({
        error:
          "カルテ作成中にエラーが発生しました。入力データを確認してください。",
      });
  }
};

// 特定のプロデューサーのカルテを取得する関数
export const getProducerChartByProducerId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { producerId } = req.params;
  try {
    // 指定されたプロデューサーIDのカルテを取得
    const [rows] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM producer_chart WHERE producer_id = ?",
      [producerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "カルテが見つかりません" });
    }

    return res.status(200).json(rows[0]);
  } catch (error: any) {
    console.error("Error fetching producer chart: ", error);
    return res.status(500).json({ error: error.message });
  }
};
