import { authenticateRequest, requireRole } from "../../lib/auth";

export default async function handler(req, res) {
  try {
    const user = authenticateRequest(req);
    requireRole(user, ["admin"]);
    // do admin stuff here
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}
