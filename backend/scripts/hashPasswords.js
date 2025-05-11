// Hash passwords from the database

import { turso } from "../../lib/db.js";
import bcrypt from "bcrypt";

const hashUserPasswords = async () => {
  const users = await turso.execute("SELECT id, password FROM users");

  for (const user of users.rows) {
    const id = user[0];
    const plainPassword = user[1];
    const hashed = await bcrypt.hash(plainPassword, 10);
    await turso.execute({
      sql: "UPDATE users SET password = ? WHERE id = ?",
      args: [hashed, id],
    });
    console.log(`Updated password for user ${id}`);
  }
};

hashUserPasswords();
