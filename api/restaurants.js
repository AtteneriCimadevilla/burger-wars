// GET all restaurants

import pool from "../lib/db.js";

import {
  getAllRestaurants,
  getTotalRestaurants,
} from "../lib/repositories/restaurants.js";
import { validateQueryParams } from "../utils/validation.js";
import { generatePaginationLinks } from "../utils/pagination.js";
import { errorHandler } from "../lib/middleware/errorHandler.js";

export default async function handler(req, res) {
  console.log("Incoming request to /api/burgers.");
  errorHandler(req, res, async () => {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    console.log(
      "📥 Incoming GET /api/restaurants request with query:",
      req.query
    );

    try {
      const { validatedSort, validatedOrder, validatedPage, validatedLimit } =
        validateQueryParams(req.query);

      const [restaurants, totalItems] = await Promise.all([
        getAllRestaurants(
          validatedSort,
          validatedOrder,
          validatedPage,
          validatedLimit
        ),
        getTotalRestaurants(),
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
        data: restaurants,
        meta: {
          totalItems,
          totalPages,
          currentPage: validatedPage,
          perPage: validatedLimit,
          links,
        },
      });
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      return res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  });
}