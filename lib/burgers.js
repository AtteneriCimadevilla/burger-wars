// DB queries

import pool from "./db.js";

const queries = {
  getAllBurgers: "SELECT * FROM burgers",
  createBurger:
    "INSERT INTO burgers (name, restaurant_id, main_ingredient, amount, bread, ingredients, more_ingredients, allergens, price, taste_rating, presentation_rating, quality_price_rating, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
};

export async function getAllBurgers(pool) {
  const [rows] = await pool.query(queries.getAllBurgers);
  return rows;
}

export async function createBurger(pool, burger) {
  const {
    name,
    restaurant_id,
    main_ingredient,
    amount,
    bread,
    ingredients,
    more_ingredients,
    allergens,
    price,
    taste_rating,
    presentation_rating,
    quality_price_rating,
    image,
  } = burger;
  const [result] = await pool.query(queries.createBurger, [
    name,
    restaurant_id,
    main_ingredient,
    amount,
    bread,
    ingredients,
    more_ingredients,
    allergens,
    price,
    taste_rating,
    presentation_rating,
    quality_price_rating,
    image,
  ]);
  return result;
}