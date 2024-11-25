import { Request, Response } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";

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

// 生産者リストを取得する関数
export const getProducers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { search } = req.query;
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

// 特定の生産者をIDで取得する関数
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

// 新しい生産者を追加する関数
export const addProducer = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    name,
    email,
    productType,
    region,
    sales,
    situation,
    supplierType,
    businessType,
    farmName,
    supplierName,
    printAbbreviation,
    printAbbreviation2,
    kanaName,
    postalCode,
    address1,
    address2,
    district,
    mobile,
    tel,
    fax,
    webPassword,
    paymentDetailType,
    paymentPassword,
    birthDate,
    officeFee,
    commissionRate,
    bankNumber,
    bankName,
    branchNumber,
    branchName,
    accountType,
    accountNumber,
    accountNameKana,
  } = req.body;

  // SQLクエリと値の配列を確認して修正
  const query = `INSERT INTO producers (
    name, email, productType, region, sales, situation,
    supplierType, businessType, farmName, supplierName,
    printAbbreviation, printAbbreviation2, kanaName,
    postalCode, address1, address2, district, mobile,
    tel, fax, webPassword, paymentDetailType, paymentPassword,
    birthDate, officeFee, commissionRate, bankNumber, bankName,
    branchNumber, branchName, accountType, accountNumber, accountNameKana
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    name,
    email,
    productType,
    region,
    sales,
    situation,
    supplierType,
    businessType,
    farmName,
    supplierName,
    printAbbreviation,
    printAbbreviation2,
    kanaName,
    postalCode,
    address1,
    address2,
    district,
    mobile,
    tel,
    fax,
    webPassword,
    paymentDetailType,
    paymentPassword,
    birthDate,
    officeFee,
    commissionRate,
    bankNumber,
    bankName,
    branchNumber,
    branchName,
    accountType,
    accountNumber,
    accountNameKana,
  ];

  try {
    const [result]: any = await dbConnection.query(query, values);

    return res.status(201).json({
      id: result.insertId,
      name,
      email,
      productType,
      region,
      sales,
      situation,
      supplierType,
      businessType,
      farmName,
      supplierName,
      printAbbreviation,
      printAbbreviation2,
      kanaName,
      postalCode,
      address1,
      address2,
      district,
      mobile,
      tel,
      fax,
      webPassword,
      paymentDetailType,
      paymentPassword,
      birthDate,
      officeFee,
      commissionRate,
      bankNumber,
      bankName,
      branchNumber,
      branchName,
      accountType,
      accountNumber,
      accountNameKana,
    });
  } catch (error: any) {
    console.error("Database error: ", error); // データベースエラーの詳細を表示
    return res.status(500).json({ error: error.message });
  }
};

// 生産者情報を更新する関数
export const updateProducer = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const {
    name,
    email,
    productType,
    region,
    sales,
    situation,
    supplierType,
    businessType,
    farmName,
    supplierName,
    printAbbreviation,
    printAbbreviation2,
    kanaName,
    postalCode,
    address1,
    address2,
    district,
    mobile,
    tel,
    fax,
    webPassword,
    paymentDetailType,
    paymentPassword,
    birthDate,
    officeFee,
    commissionRate,
    bankNumber,
    bankName,
    branchNumber,
    branchName,
    accountType,
    accountNumber,
    accountNameKana,
  } = req.body;

  try {
    await dbConnection.query(
      `UPDATE producers SET name = ?, email = ?, productType = ?, region = ?, sales = ?, situation = ?,
        supplierType = ?, businessType = ?, farmName = ?, supplierName = ?, printAbbreviation = ?,
        printAbbreviation2 = ?, kanaName = ?, postalCode = ?, address1 = ?, address2 = ?, district = ?,
        mobile = ?, tel = ?, fax = ?, webPassword = ?, paymentDetailType = ?, paymentPassword = ?,
        birthDate = ?, officeFee = ?, commissionRate = ?, bankNumber = ?, bankName = ?, branchNumber = ?,
        branchName = ?, accountType = ?, accountNumber = ?, accountNameKana = ? WHERE id = ?`,
      [
        name,
        email,
        productType,
        region,
        sales,
        situation,
        supplierType,
        businessType,
        farmName,
        supplierName,
        printAbbreviation,
        printAbbreviation2,
        kanaName,
        postalCode,
        address1,
        address2,
        district,
        mobile,
        tel,
        fax,
        webPassword,
        paymentDetailType,
        paymentPassword,
        birthDate,
        officeFee,
        commissionRate,
        bankNumber,
        bankName,
        branchNumber,
        branchName,
        accountType,
        accountNumber,
        accountNameKana,
        id,
      ]
    );

    return res.status(200).json({
      id,
      name,
      email,
      productType,
      region,
      sales,
      situation,
      supplierType,
      businessType,
      farmName,
      supplierName,
      printAbbreviation,
      printAbbreviation2,
      kanaName,
      postalCode,
      address1,
      address2,
      district,
      mobile,
      tel,
      fax,
      webPassword,
      paymentDetailType,
      paymentPassword,
      birthDate,
      officeFee,
      commissionRate,
      bankNumber,
      bankName,
      branchNumber,
      branchName,
      accountType,
      accountNumber,
      accountNameKana,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// 生産者情報を削除する関数
export const deleteProducer = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params; // パスパラメータから生産者IDを取得
  try {
    // 指定されたIDの生産者を削除するクエリ
    await dbConnection.query("DELETE FROM producers WHERE id = ?", [id]);
    // 成功時：削除成功メッセージをステータスコード200で返す
    return res.status(200).json({ message: "Producer deleted" });
  } catch (error: any) {
    // エラー時：エラーメッセージをステータスコード500で返す
    return res.status(500).json({ error: error.message });
  }
};

// プロデューサーの検索を行う関数
export const searchProducers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { query } = req.query;

  try {
    const [rows] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM producers WHERE name LIKE ?",
      [`%${query}%`]
    );
    return res.status(200).json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
