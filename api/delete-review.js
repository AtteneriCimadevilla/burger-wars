import { turso } from "../lib/db.js";
import { authenticateRequest } from "../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const decoded = authenticateRequest(req);
    const { reviewId } = req.body;

    if (!reviewId) {
      return res.status(400).json({ error: "Review ID is required" });
    }

    // Check if the review exists and belongs to the authenticated user
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
        .json({ error: "You can only delete your own reviews" });
    }

    // Delete the review
    await turso.execute({
      sql: "DELETE FROM reviews WHERE id = ?",
      args: [reviewId],
    });

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/delete-review error:", err);
    if (
      err.message === "No token provided" ||
      err.message === "Invalid token format"
    ) {
      return res.status(401).json({ error: "Authentication required" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
