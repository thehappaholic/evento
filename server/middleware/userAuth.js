import jwt from "jsonwebtoken";

// Use this middleware to protect routes (verifies JWT from cookie or Authorization header)
const requireAuth = (req, res, next) => {
  let token = req.cookies?.token;

  // Also support Bearer token
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized: invalid token" });
  }
};

export default requireAuth;
export { requireAuth };
