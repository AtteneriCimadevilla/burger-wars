// scripts/test-db.js
import pool from "../lib/db.js";

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT NOW() AS time");
    console.log("✅ DB Time:", rows[0].time);
  } catch (error) {
    console.error("❌ DB Error:", error.message);
  }
}

testConnection();
