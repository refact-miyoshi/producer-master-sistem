import { Request, Response } from "express";
import mysql from "mysql2/promise";

const dbConnection = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: parseInt(process.env.DB_PORT as string, 10),
});

// 生産者カルテ情報を保存する関数
export const createProducerRecord = async (req: Request, res: Response) => {
  const {
    producer_number,
    name,
    birthdate,
    health_status,
    address,
    business_type,
    farm_type,
    farm_scale,
    main_product,
    tel,
    mobile,
    fax,
    email,
    farming_years,
    continuation_years,
    has_successor,
    employee_count,
    field_address1,
    field_area1,
    field_address2,
    field_area2,
    field_address3,
    field_area3,
    delivery_method,
    material_supplier,
    uses_pesticides,
    annual_sales,
    everly_sales_year1,
    everly_sales_year2,
    everly_sales_year3,
    annual_schedule,
    everly_requests,
    other_outlets,
    remarks,
  } = req.body;

  try {
    // Cast the result to 'ResultSetHeader' to access the 'insertId'
    const [result] = await dbConnection.query<mysql.ResultSetHeader>(
      `INSERT INTO producer_records (producer_number, name, birthdate, health_status, address, 
       business_type, farm_type, farm_scale, main_product, tel, mobile, fax, email, 
       farming_years, continuation_years, has_successor, employee_count, field_address1, 
       field_area1, field_address2, field_area2, field_address3, field_area3, 
       delivery_method, material_supplier, uses_pesticides, annual_sales, everly_sales_year1, 
       everly_sales_year2, everly_sales_year3, annual_schedule, everly_requests, 
       other_outlets, remarks) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        producer_number,
        name,
        birthdate,
        health_status,
        address,
        business_type,
        farm_type,
        farm_scale,
        main_product,
        tel,
        mobile,
        fax,
        email,
        farming_years,
        continuation_years,
        has_successor,
        employee_count,
        field_address1,
        field_area1,
        field_address2,
        field_area2,
        field_address3,
        field_area3,
        delivery_method,
        material_supplier,
        uses_pesticides,
        annual_sales,
        everly_sales_year1,
        everly_sales_year2,
        everly_sales_year3,
        annual_schedule,
        everly_requests,
        other_outlets,
        remarks,
      ]
    );

    // Access the insertId from the result
    res
      .status(201)
      .json({ message: "カルテが保存されました", id: result.insertId });
  } catch (error) {
    console.error("カルテ保存エラー:", error);
    res.status(500).json({ message: "カルテ保存に失敗しました" });
  }
};
