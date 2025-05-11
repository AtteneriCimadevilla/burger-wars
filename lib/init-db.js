import { turso } from "../lib/db.js";
import fs from "fs/promises";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Load and apply schema
    const schemaSql = await fs.readFile("lib/schema.sql", "utf8");
    const schemaStatements = schemaSql
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const stmt of schemaStatements) {
      await turso.execute(stmt);
    }

    // Load and apply seed
    const seedSql = await fs.readFile("lib/seed.sql", "utf8");
    const seedStatements = seedSql
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const stmt of seedStatements) {
      await turso.execute(stmt);
    }

    return res
      .status(200)
      .json({ success: true, message: "Database initialized and seeded." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
