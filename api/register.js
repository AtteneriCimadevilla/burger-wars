import bcrypt from "bcrypt";
import { turso } from "../lib/db.js";
import { generateToken } from "../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    // Check if username or email already exists
    const existingUser = await turso.execute({
      sql: "SELECT id FROM users WHERE username = ? OR email = ?",
      args: [username, email],
    });

    if (existingUser.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Username or email already in use." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await turso.execute({
      sql: "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      args: [username, email, hashedPassword, "user"],
    });

    const userId = result.lastInsertRowid;

    // Generate token
    const token = generateToken({
      id: userId,
      username,
      email,
      role: "user",
    });

    return res.status(201).json({
      token,
      user: { id: userId, username, email, role: "user" },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
