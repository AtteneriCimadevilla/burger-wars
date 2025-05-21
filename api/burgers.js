import { turso } from "../lib/db.js";

export default async function handler(req, res) {
  const { id, restaurant_id } = req.query;

  try {

    let query = "SELECT * FROM burgers";
    let args = [];

    // Handle single burger
    if (id) {
      query += " WHERE id = ?";
      args.push(id);
    }

    // Handle filtering by restaurant
    else if (restaurant_id) {
      query += " WHERE restaurant_id = ?";
      args.push(restaurant_id);
    }

    const result = await turso.execute(query, args);

    if (!result.rows.length && id) {
      return res.status(404).json({ error: "Burger not found" });
    }

    return res.status(200).json(id ? result.rows[0] : result.rows);

  } catch (error) {

    console.error("Failed to load burgers:", error);
    return res.status(500).json({ error: "Internal Server Error" });
    
  }
}
