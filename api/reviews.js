// File: /api/reviews.js
import { turso } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const burgerId = req.query.burger_id;
      if (!burgerId) {
        return res.status(400).json({ error: "burger_id is required" });
      }

      const { rows } = await turso.execute({
        sql: `
          SELECT r.*, u.username 
          FROM reviews r
          JOIN users u ON r.user_id = u.id
          WHERE r.burger_id = ?
        `,
        args: [burgerId],
      });

      return res.status(200).json(rows);
    } catch (err) {
      console.error("GET /api/reviews error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    try {
      const {
        burger_id,
        user_id,
        taste_rating,
        presentation_rating,
        quality_price_rating,
        comment,
      } = req.body;

      if (
        !burger_id ||
        !user_id ||
        taste_rating == null ||
        presentation_rating == null ||
        quality_price_rating == null
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { lastInsertRowid } = await turso.execute({
        sql: `
          INSERT INTO reviews (burger_id, user_id, taste_rating, presentation_rating, quality_price_rating, comment)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [
          burger_id,
          user_id,
          taste_rating,
          presentation_rating,
          quality_price_rating,
          comment || null,
        ],
      });

      return res.status(201).json({ id: lastInsertRowid });
    } catch (err) {
      console.error("POST /api/reviews error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
