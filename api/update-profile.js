import bcrypt from "bcrypt";
import { turso } from "../lib/db.js";
import { authenticateRequest } from "../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const decoded = authenticateRequest(req);
    const { username, email, password } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: "Username and email are required" });
    }

    // Check if username or email already exists for other users
    const existingUser = await turso.execute({
      sql: "SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?",
      args: [username, email, decoded.id],
    });

    if (existingUser.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Username or email already exists" });
    }

    let updateQuery = "UPDATE users SET username = ?, email = ?";
    const args = [username, email];

    // If password is provided, hash it and include in update
    if (password && password.length >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ", password = ?";
      args.push(hashedPassword);
    } else if (password && password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    updateQuery += " WHERE id = ?";
    args.push(decoded.id);

    await turso.execute({
      sql: updateQuery,
      args: args,
    });

    // Get updated user data
    const result = await turso.execute({
      sql: "SELECT id, username, email, role FROM users WHERE id = ?",
      args: [decoded.id],
    });

    const user = result.rows[0];
    const userData = {
      id: user[0],
      username: user[1],
      email: user[2],
      role: user[3],
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: userData,
    });
  } catch (err) {
    console.error("PUT /api/update-profile error:", err);
    if (
      err.message === "No token provided" ||
      err.message === "Invalid token format"
    ) {
      return res.status(401).json({ error: "Authentication required" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
