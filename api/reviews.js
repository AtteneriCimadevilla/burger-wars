import { turso } from "../lib/db.js";
import { authenticateRequest } from "../lib/auth.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { burger_id, user_id } = req.query;

      let query = "";
      let args = [];

      if (burger_id) {
        // Get reviews for a specific burger
        query = `
         SELECT 
           r.id, 
           r.burger_id, 
           r.user_id,
           r.taste_rating, 
           r.presentation_rating, 
           r.quality_price_rating, 
           r.comment,
           u.username,
           NULL as burger_name,
           NULL as burger_image,
           NULL as restaurant_id,
           NULL as restaurant_name
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.burger_id = ?
         ORDER BY r.id DESC
       `;
        args = [burger_id];
      } else if (user_id) {
        // Get reviews by a specific user (requires authentication)
        const decoded = authenticateRequest(req);

        // Only allow users to see their own reviews
        if (decoded.id !== Number.parseInt(user_id)) {
          return res
            .status(403)
            .json({ error: "You can only view your own reviews" });
        }

        query = `
         SELECT 
           r.id,
           r.burger_id,
           r.user_id,
           r.taste_rating,
           r.presentation_rating,
           r.quality_price_rating,
           r.comment,
           u.username,
           b.name as burger_name,
           b.image as burger_image,
           rest.id as restaurant_id,
           rest.name as restaurant_name
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         JOIN burgers b ON r.burger_id = b.id
         JOIN restaurants rest ON b.restaurant_id = rest.id
         WHERE r.user_id = ?
         ORDER BY r.id DESC
       `;
        args = [user_id];
      } else {
        return res
          .status(400)
          .json({ error: "Either burger_id or user_id is required" });
      }

      const { rows } = await turso.execute({
        sql: query,
        args: args,
      });

      // Format the response to match the expected structure
      const formattedReviews = rows.map((row) => ({
        id: row[0],
        burger_id: row[1],
        user_id: row[2],
        taste_rating: row[3],
        presentation_rating: row[4],
        quality_price_rating: row[5],
        comment: row[6],
        username: row[7],
        burger_name: row[8],
        burger_image: row[9],
        restaurant_id: row[10],
        restaurant_name: row[11],
      }));

      return res.status(200).json(formattedReviews);
    } catch (err) {
      console.error("GET /api/reviews error:", err);
      if (
        err.message === "No token provided" ||
        err.message === "Invalid token format"
      ) {
        return res.status(401).json({ error: "Authentication required" });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    try {
      // Authenticate user
      const decoded = authenticateRequest(req);

      const {
        burger_id,
        taste_rating,
        presentation_rating,
        quality_price_rating,
        comment,
      } = req.body;

      console.log("Received review data:", {
        burger_id,
        taste_rating,
        presentation_rating,
        quality_price_rating,
        comment,
        user_id: decoded.id,
      });

      if (
        !burger_id ||
        taste_rating == null ||
        presentation_rating == null ||
        quality_price_rating == null
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Validate ratings are between 0-5
      const ratings = [taste_rating, presentation_rating, quality_price_rating];
      if (ratings.some((rating) => rating < 0 || rating > 5)) {
        return res
          .status(400)
          .json({ error: "Ratings must be between 0 and 5" });
      }

      // Check if user already reviewed this burger
      const existingReview = await turso.execute({
        sql: "SELECT id FROM reviews WHERE burger_id = ? AND user_id = ?",
        args: [burger_id, decoded.id],
      });

      if (existingReview.rows.length > 0) {
        return res
          .status(409)
          .json({ error: "You have already reviewed this burger" });
      }

      const { lastInsertRowid } = await turso.execute({
        sql: `
         INSERT INTO reviews (burger_id, user_id, taste_rating, presentation_rating, quality_price_rating, comment)
         VALUES (?, ?, ?, ?, ?, ?)
       `,
        args: [
          burger_id,
          decoded.id,
          taste_rating,
          presentation_rating,
          quality_price_rating,
          comment || null,
        ],
      });

      console.log("Review saved successfully with ID:", lastInsertRowid);

      return res.status(201).json({
        id: lastInsertRowid,
        message: "Review created successfully",
      });
    } catch (err) {
      console.error("POST /api/reviews error:", err);
      if (
        err.message === "No token provided" ||
        err.message === "Invalid token format"
      ) {
        return res.status(401).json({ error: "Authentication required" });
      }
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
