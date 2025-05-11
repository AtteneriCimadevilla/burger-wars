import bcrypt from "bcrypt";
import { turso } from "../lib/db.js"; // adjust path as needed
import { generateToken } from "../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  const { username, password } = req.body;

  const result = await turso.execute({
    sql: "SELECT * FROM users WHERE username = ?",
    args: [username],
  });

  if (!result.rows.length)
    return res.status(401).json({ error: "Invalid credentials" });

  const [id, usernameDb, passwordHash, email, role] = result.rows[0];
  const match = await bcrypt.compare(password, passwordHash);

  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = generateToken({ id, username, role });
  return res.status(200).json({ token });
}
