import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const dbConnection = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: parseInt(process.env.DB_PORT as string, 10),
});

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const [rows]: any = await dbConnection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.email }, "supersecretkey", {
      expiresIn: 86400, // 24 hours
    });

    return res.status(200).json({ auth: true, token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const [result]: any = await dbConnection.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    const token = jwt.sign({ id: email }, "supersecretkey", {
      expiresIn: 86400, // 24 hours
    });

    return res.status(200).json({ auth: true, token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
