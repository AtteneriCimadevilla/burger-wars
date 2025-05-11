import jwt from "jsonwebtoken";

export function authenticateRequest(req) {
  const header = req.headers.authorization;
  if (!header) throw new Error("No token provided");

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}

export function requireRole(decoded, roles = []) {
  if (!roles.includes(decoded.role)) {
    throw new Error("Forbidden");
  }
}
