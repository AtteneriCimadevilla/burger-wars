// GET all, POST new burger

import { pool } from "@/lib/db";
import { getAllBurgers, createBurger } from "@/lib/burgers";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const burgers = await getAllBurgers(pool);
      res.status(200).json(burgers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch burgers" });
    }
  } else if (req.method === "POST") {
    const burgerData = req.body;
    try {
      await createBurger(pool, burger);
      res.status(201).json({ message: "Burger created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create burger" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}