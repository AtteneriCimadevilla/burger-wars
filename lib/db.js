import mysql from "mysql2/promise";

// Detecta si estamos en Vercel
const isVercel = !!process.env.VERCEL;

// Configura SSL dinámicamente
const ssl = process.env.AIVEN_CA_CERT
  ? { rejectUnauthorized: true, ca: process.env.AIVEN_CA_CERT }
  : isVercel
  ? undefined // No usar SSL si no hay cert y estamos en Vercel
  : {
      rejectUnauthorized: true,
      ca: fs.readFileSync("certs/aiven-ca.pem"),
    };

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
