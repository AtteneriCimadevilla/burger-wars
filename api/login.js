import bcrypt from "bcrypt";
import { turso } from "../lib/db.js";
import { generateToken } from "../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  const { username, email, password } = req.body;

  // Allow login with either username or email
  const loginField = username || email;
  const fieldType = username ? "username" : "email";

  if (!loginField || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    console.log(`Attempting login with ${fieldType}: ${loginField}`);

    const result = await turso.execute({
      sql: `SELECT * FROM users WHERE ${fieldType} = ?`,
      args: [loginField],
    });

    if (!result.rows.length) {
      console.log("No user found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const id = user[0];
    const usernameDb = user[1];
    const passwordHash = user[2];
    const emailDb = user[3];
    const role = user[4];

    console.log("User found, comparing passwords");

    // For debugging only - remove in production
    console.log(`Stored hash: ${passwordHash}`);
    console.log(`Provided password: ${password}`);

    const match = await bcrypt.compare(password, passwordHash);

    if (!match) {
      console.log("Password doesn't match");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("Password matches, generating token");

    const token = generateToken({
      id,
      username: usernameDb,
      email: emailDb,
      role,
    });

    console.log("Login successful");

    return res.status(200).json({
      token,
      user: { id, username: usernameDb, email: emailDb, role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
