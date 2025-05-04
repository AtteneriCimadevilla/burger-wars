import pool from "../db.js";

export async function getAllRestaurants() {
  const [rows] = await pool.query(`
    SELECT 
      r.*,
      ROUND(AVG((b.taste_rating + b.presentation_rating + b.quality_price_rating) / 3), 2) AS rating
    FROM restaurants r
    LEFT JOIN burgers b ON r.id = b.restaurant_id
    GROUP BY r.id
    ORDER BY rating DESC
  `);

  return rows;
}

export async function getTotalRestaurants() {
  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM restaurants");
  return rows[0].total;
}

export async function createRestaurant(restaurant) {
  const { id, name, address, url, image, website } = restaurant;
  const [result] = await pool.query(
    "INSERT INTO restaurants (id, name,  address, url, image, website) VALUES (?, ?, ?, ?, ?, ?)",
    [id, name, address, url, image, website]
  );
  return result;
}
