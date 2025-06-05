import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export function authenticateRequest(req) {
  const header = req.headers.authorization;
  if (!header) {
    console.log("No authorization header provided");
    throw new Error("No token provided");
  }

  // Log the full header for debugging
  console.log("Authorization header:", header);

  // Check if the header follows the Bearer token format
  if (!header.startsWith("Bearer ")) {
    console.log(
      "Invalid authorization header format (missing 'Bearer' prefix)"
    );
    throw new Error("Invalid token format: missing Bearer prefix");
  }

  const token = header.split(" ")[1];
  if (!token) {
    console.log("Invalid token format in header (no token after 'Bearer')");
    throw new Error("Invalid token format: no token found");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Token verified successfully:", decoded);
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error.message);
    throw new Error("Invalid token: " + error.message);
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
