import { turso } from "../lib/db.js";
import { authenticateRequest } from "../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const decoded = authenticateRequest(req);
    const {
      reviewId,
      taste_rating,
      presentation_rating,
      quality_price_rating,
      comment,
    } = req.body;

    if (
      !reviewId ||
      taste_rating == null ||
      presentation_rating == null ||
      quality_price_rating == null
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate ratings are between 0-5
    const ratings = [taste_rating, presentation_rating, quality_price_rating];
    if (ratings.some((rating) => rating < 0 || rating > 5)) {
      return res.status(400).json({ error: "Ratings must be between 0 and 5" });
    }

    // Check if the review belongs to the authenticated user
    const reviewCheck = await turso.execute({
      sql: "SELECT user_id FROM reviews WHERE id = ?",
      args: [reviewId],
    });

    if (!reviewCheck.rows.length) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (reviewCheck.rows[0][0] !== decoded.id) {
      return res
        .status(403)
        .json({ error: "You can only edit your own reviews" });
    }

    // Update the review
    await turso.execute({
      sql: `
        UPDATE reviews 
        SET taste_rating = ?, presentation_rating = ?, quality_price_rating = ?, comment = ?
        WHERE id = ?
      `,
      args: [
        taste_rating,
        presentation_rating,
        quality_price_rating,
        comment || null,
        reviewId,
      ],
    });

    return res.status(200).json({ message: "Review updated successfully" });
  } catch (err) {
    console.error("PUT /api/update-review error:", err);
    if (
      err.message === "No token provided" ||
      err.message === "Invalid token format"
    ) {
      return res.status(401).json({ error: "Authentication required" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
