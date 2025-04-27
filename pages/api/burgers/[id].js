// GET, PUT, DELETE single burger

import pool from "../../lib/db";

const queries = {
    getBurger: "SELECT * FROM burgers WHERE id = ?",
    updateBurger: "UPDATE burgers SET name = ?, restaurant_id = ?, main_ingredient = ?, amount = ?, bread = ?, ingredients = ?, more_ingredients = ?, allergens = ?, price = ?, taste_rating = ?, presentation_rating = ?, quality_price_rating = ?, image = ? WHERE id = ?",
    deleteBurger: "DELETE FROM burgers WHERE id = ?",
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const [burger] = await pool.query(
        queries.updateBurger, [
        id,
      ]);
      if (burger.length === 0) {
        res.status(404).json({ error: "Burger not found" });
      } else {
        res.status(200).json(burger[0]);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch burger" });
    }
  } else if (req.method === "PUT") {
    const burger = req.body;
    try {
      await pool.query(
        "UPDATE burgers SET name = ?, restaurant_id = ?, main_ingredient = ?, amount = ?, bread = ?, ingredients = ?, price = ?, ratings = ? WHERE id = ?",
        [
          burger.name,
          burger.restaurant_id,
          burger.main_ingredient,
          burger.amount,
          burger.bread,
          burger.ingredients,
          burger.more_ingredients,
          burger.allergens,
          burger.price,
          burger.taste_rating,
          burger.presentation_rating,
          burger.quality_price_rating,
          burger.image,
          id,
        ]
      );
      res.status(200).json({ message: "Burger updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update burger" });
    }
  } else if (req.method === "DELETE") {
    try {
      await pool.query(queries.deleteBurger, [id]);
      res.status(200).json({ message: "Burger deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete burger" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
