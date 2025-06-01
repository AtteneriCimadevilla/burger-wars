import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export function authenticateRequest(req) {
  const header = req.headers.authorization;
  if (!header) {
    console.log("No authorization header provided");
    throw new Error("No token provided");
  }

  const token = header.split(" ")[1];
  if (!token) {
    console.log("Invalid token format in header");
    throw new Error("Invalid token format");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Token verified successfully");
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error.message);
    throw new Error("Invalid token");
  }
}

export function requireRole(decoded, roles = []) {
  if (!roles.includes(decoded.role)) {
    throw new Error("Forbidden");
  }
}

export function generateToken(user) {
  console.log("Generating token for user:", user);
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
