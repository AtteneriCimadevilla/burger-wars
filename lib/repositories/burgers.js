// DB queries

import pool from "../db";

export async function getAllBurgers(sort = 'rating', order = 'DESC', page = 1, limit = 12, restaurant_id = null) {
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM burgers WHERE 1';

  const params = [];

  if (restaurant_id) {
    query += ' AND restaurant_id = ?';
    params.push(restaurant_id);
  }

  query += ' ORDER BY ${sort} ${order} LIMIT ? OFFSET ?';

  params.push(limit, offset);

  const [rows] = await pool.query(query, params);
  return rows;
}


export async function getTotalBurgers() {
  const [rows] = await pool.query("SELECT COUNT(*) as count FROM burgers");
  return rows[0].count;
}

export async function createBurger(burger) {
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

  const [result] = await pool.query(
    `INSERT INTO burgers 
     (name, restaurant_id, main_ingredient, amount, bread, ingredients, more_ingredients, allergens, price, taste_rating, presentation_rating, quality_price_rating, image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
    ]
  );
  return result.insertId;
}
