// lib/middleware/errorHandler.js
export async function errorHandler(req, res, next) {
  try {
    await next();
  } catch (error) {
    console.error("Error encountered:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
