// ← utility functions (hash, token sign/verify)

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    SECRET,
    { expiresIn: "1h" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
