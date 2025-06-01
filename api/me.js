import { turso } from "../lib/db.js";
import { authenticateRequest } from "../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Log the authorization header for debugging
    console.log("Auth header:", req.headers.authorization);

    const decoded = authenticateRequest(req);

    console.log("Decoded token:", decoded);

    // Get fresh user data from database
    const result = await turso.execute({
      sql: "SELECT id, username, email, role FROM users WHERE id = ?",
      args: [decoded.id],
    });

    if (!result.rows.length) {
      console.log("User not found in database");
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const userData = {
      id: user[0],
      username: user[1],
      email: user[2],
      role: user[3],
    };

    console.log("User data retrieved:", userData);

    return res.status(200).json(userData);
  } catch (error) {
    console.error("Auth me error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
