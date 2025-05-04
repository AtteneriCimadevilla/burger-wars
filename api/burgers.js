// GET all, POST new burger

import pool from "../lib/db.js";

import { getAllBurgers } from "../lib/repositories/burgers.js";
import { errorHandler } from "../lib/middleware/errorHandler.js";

export default async function handler(req, res) {  
  errorHandler(req, res, async () => {
    if (req.method === "GET") {
      const { restaurant_id } = req.query;

      try {
        const burgers = await getAllBurgers(restaurant_id);
        return res.status(200).json({ data: burgers });
      } catch (error) {
        console.error("Error fetching burgers:", error);
        return res.status(500).json({ error: "Failed to fetch burgers" });
      }
      
    } else if (req.method === "POST") {
      const burger = req.body;

      if (!burger || !burger.name || !burger.restaurant_id) {
        return res
          .status(400)
          .json({ error: "Missing required burger fields." });
      }

      const insertedId = await createBurger(burger);
      return res
        .status(201)
        .json({ message: "Burger created successfully", burgerId: insertedId });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  });
}
