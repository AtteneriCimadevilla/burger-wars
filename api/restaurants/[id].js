import { getRestaurantById } from "../lib/repositories/restaurants.js";
import { errorHandler } from "../lib/middleware/errorHandler.js";

export default async function handler(req, res) {
  errorHandler(req, res, async () => {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
      const restaurant = await getRestaurantById(req.query.id);
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      return res.status(200).json({ data: restaurant });
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      return res.status(500).json({ error: "Failed to fetch restaurant" });
    }
  });
}
