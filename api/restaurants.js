// GET all restaurants

import { getAllRestaurants } from "../lib/repositories/restaurants.js";
import { errorHandler } from "../lib/middleware/errorHandler.js";

export default async function handler(req, res) {
  console.log("Incoming request to /api/restaurants.");
  
  errorHandler(req, res, async () => {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
      const restaurants = await getAllRestaurants();
      return res.status(200).json({data: restaurants});
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      return res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  });
}