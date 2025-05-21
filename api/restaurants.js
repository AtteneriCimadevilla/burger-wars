import { turso } from "../lib/db.js";

export default async function handler(req, res) {
  const { id } = req.query;

  try {

    let query = "SELECT * FROM restaurants";

    if (id) {
      query += " WHERE id = ?";
      const result = await turso.execute(query, [id]);
      if (!result.rows.length) {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      return res.status(200).json(result.rows[0]);
    }

    const restaurants = await turso.execute(query);
    return res.status(200).json(restaurants.rows);

  } catch (error) {

    console.error("Failed to load restaurants:", error);
    return res.status(500).json({ error: "Internal Server Error" });

  }
}
