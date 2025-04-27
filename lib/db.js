// connection pool setup

import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

const ssl = process.env.AIVEN_CA_CERT
  ? { rejectUnauthorized: true, ca: process.env.AIVEN_CA_CERT }
  : {
      rejectUnauthorized: true,
      ca: fs.readFileSync(path.join(__dirname, "../certs/aiven-ca.pem")),
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