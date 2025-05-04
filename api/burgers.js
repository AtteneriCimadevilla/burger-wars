// GET all, POST new burger

import pool from "../lib/db.js";

import {
  getAllBurgers,
  getTotalBurgers,
  createBurger,
} from "../lib/repositories/burgers.js";
import { validateQueryParams } from "../utils/validation.js";
import { generatePaginationLinks } from "../utils/pagination.js";
import { errorHandler } from "../lib/middleware/errorHandler.js";

export default async function handler(req, res) {
  console.log("Incoming request to /api/burgers.");
  
  errorHandler(req, res, async () => {
    if (req.method === "GET") {
      const { validatedSort, validatedOrder, validatedPage, validatedLimit } =
        validateQueryParams(req.query);
      const { restaurant_id } = req.query;

      const [burgers, totalItems] = await Promise.all([
        getAllBurgers(
          validatedSort,
          validatedOrder,
          validatedPage,
          validatedLimit,
          restaurant_id
        ),
        getTotalBurgers(restaurant_id),
      ]);

      const totalPages = Math.ceil(totalItems / validatedLimit);
      const links = generatePaginationLinks(
        req,
        validatedPage,
        totalPages,
        validatedLimit,
        validatedSort,
        validatedOrder
      );

      return res.status(200).json({
        data: burgers,
        meta: {
          totalItems,
          totalPages,
          currentPage: validatedPage,
          perPage: validatedLimit,
          links,
        },
      });
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
