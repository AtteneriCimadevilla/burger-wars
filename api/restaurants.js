import { turso } from "../lib/db.js";

export default async function handler(req, res) {
  try {
    const restaurants = await turso.execute("SELECT * FROM restaurants");
    res.status(200).json(restaurants.rows);
  } catch (error) {
    console.error("Failed to load restaurants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
