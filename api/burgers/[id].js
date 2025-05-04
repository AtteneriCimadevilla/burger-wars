import { getBurgerById } from "../lib/repositories/burgers.js";
import { errorHandler } from "../lib/middleware/errorHandler.js";

export default async function handler(req, res) {
  errorHandler(req, res, async () => {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
      const burger = await getBurgerById(req.query.id);
      if (!burger) {
        return res.status(404).json({ error: "Burger not found" });
      }
      return res.status(200).json({ data: burger });
    } catch (error) {
      console.error("Error fetching burger:", error);
      return res.status(500).json({ error: "Failed to fetch burger" });
    }
  });
}
