import pool from '../db';

export async function getAllRestaurants(
  sort = "name",
  order = "asc",
  page = 1,
  limit = 12
) {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT 
        r.*,
        AVG((b.taste_rating + b.presentation_rating + b.quality_price_rating) / 3) AS rating
     FROM restaurants r
     LEFT JOIN burgers b ON r.id = b.restaurant_id
     GROUP BY r.id
     ORDER BY ?? ${order === "desc" ? "DESC" : "ASC"}
     LIMIT ?
     OFFSET ?`,
    [sort, limit, offset]
  );

  // Round rating to 2 decimals if needed
  const restaurants = rows.map((r) => ({
    ...r,
    rating: r.rating ? Number(r.rating.toFixed(2)) : null,
  }));

  return restaurants;
}

export async function getTotalRestaurants() {
  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM restaurants");
  return rows[0].total;
}

export async function createRestaurant(restaurant) {
  const { id, name, address, url, image, website } = restaurant;
  const [result] = await pool.query('INSERT INTO restaurants (id, name,  address, url, image, website) VALUES (?, ?, ?, ?, ?, ?)', [
    id,
    name,
    address,
    url,
    image,
    website 
  ]);
  return result;
}



