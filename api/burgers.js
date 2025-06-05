import { turso } from "../lib/db.js";

export default async function handler(req, res) {
  const { id, restaurant_id } = req.query;

  try {
    let query = "";
    const args = [];

    // Handle single burger
    if (id) {
      query = `
        SELECT 
          b.id,
          b.name,
          b.restaurant_id,
          b.main_ingredient,
          b.amount,
          b.bread,
          b.ingredients,
          b.more_ingredients,
          b.allergens,
          b.price,
          b.image,
          COALESCE(AVG(r.taste_rating), 0) as taste_rating,
          COALESCE(AVG(r.presentation_rating), 0) as presentation_rating,
          COALESCE(AVG(r.quality_price_rating), 0) as quality_price_rating,
          COUNT(r.id) as review_count
        FROM burgers b
        LEFT JOIN reviews r ON b.id = r.burger_id
        WHERE b.id = ?
        GROUP BY b.id, b.name, b.restaurant_id, b.main_ingredient, b.amount, b.bread, b.ingredients, b.more_ingredients, b.allergens, b.price, b.image
      `;
      args.push(id);
    }
    // Handle filtering by restaurant
    else if (restaurant_id) {
      query = `
        SELECT 
          b.id,
          b.name,
          b.restaurant_id,
          b.main_ingredient,
          b.amount,
          b.bread,
          b.ingredients,
          b.more_ingredients,
          b.allergens,
          b.price,
          b.image,
          COALESCE(AVG(r.taste_rating), 0) as taste_rating,
          COALESCE(AVG(r.presentation_rating), 0) as presentation_rating,
          COALESCE(AVG(r.quality_price_rating), 0) as quality_price_rating,
          COUNT(r.id) as review_count
        FROM burgers b
        LEFT JOIN reviews r ON b.id = r.burger_id
        WHERE b.restaurant_id = ?
        GROUP BY b.id, b.name, b.restaurant_id, b.main_ingredient, b.amount, b.bread, b.ingredients, b.more_ingredients, b.allergens, b.price, b.image
      `;
      args.push(restaurant_id);
    }
    // Handle all burgers
    else {
      query = `
        SELECT 
          b.id,
          b.name,
          b.restaurant_id,
          b.main_ingredient,
          b.amount,
          b.bread,
          b.ingredients,
          b.more_ingredients,
          b.allergens,
          b.price,
          b.image,
          COALESCE(AVG(r.taste_rating), 0) as taste_rating,
          COALESCE(AVG(r.presentation_rating), 0) as presentation_rating,
          COALESCE(AVG(r.quality_price_rating), 0) as quality_price_rating,
          COUNT(r.id) as review_count
        FROM burgers b
        LEFT JOIN reviews r ON b.id = r.burger_id
        GROUP BY b.id, b.name, b.restaurant_id, b.main_ingredient, b.amount, b.bread, b.ingredients, b.more_ingredients, b.allergens, b.price, b.image
      `;
    }

    const result = await turso.execute(query, args);

    if (!result.rows.length && id) {
      return res.status(404).json({ error: "Burger not found" });
    }

    // Process the results to format the data properly
    const processedResults = result.rows.map((row) => {
      const burger = {
        id: row[0],
        name: row[1],
        restaurant_id: row[2],
        main_ingredient: row[3],
        amount: row[4],
        bread: row[5],
        ingredients: row[6],
        more_ingredients: row[7],
        allergens: row[8],
        price: row[9],
        image: row[10], // This should now be in the correct position
        // Dynamic ratings from reviews
        taste_rating: Math.round(row[11] * 100) / 100, // Round to 2 decimal places
        presentation_rating: Math.round(row[12] * 100) / 100,
        quality_price_rating: Math.round(row[13] * 100) / 100,
        review_count: row[14],
      };

      // Calculate overall rating as average of the three ratings
      burger.rating =
        Math.round(
          ((burger.taste_rating +
            burger.presentation_rating +
            burger.quality_price_rating) /
            3) *
            100
        ) / 100;

      return burger;
    });

    return res.status(200).json(id ? processedResults[0] : processedResults);
  } catch (error) {
    console.error("Failed to load burgers:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
