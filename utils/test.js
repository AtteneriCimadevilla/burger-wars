// api/test.js
import { config } from "dotenv";
import { createPool } from "mysql2/promise";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, "..", ".env.local") });

console.log("🔌 Loaded DB_USER:", process.env.DB_USER);
console.log("🔌 Connecting to DB_NAME:", process.env.DB_NAME);

const pool = createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function testConnection() {
  try {
    const [tables] = await pool.query("SHOW TABLES");
    console.log("✅ Tables:", tables);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testConnection();
