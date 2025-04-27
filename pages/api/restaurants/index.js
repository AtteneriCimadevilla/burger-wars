// pages/api/restaurants/index.js
import {
  getAllRestaurants,
  getTotalRestaurants,
} from "@/lib/repositories/restaurants";
import { validateQueryParams } from "@/utils/validation";
import { generatePaginationLinks } from "@/utils/pagination";
import { errorHandler } from "@/lib/middleware/errorHandler";

export default async function handler(req, res) {
  errorHandler(req, res, async () => {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

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
      console.error("Error in restaurants handler:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  })
}
