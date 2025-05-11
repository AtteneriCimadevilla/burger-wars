import { turso } from "../lib/db.js";

export default async function handler(req, res) {
  try {
    const burgers = await turso.execute("SELECT * FROM burgers");
    res.status(200).json(burgers.rows);
  } catch (error) {
    console.error("Failed to load burgers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
