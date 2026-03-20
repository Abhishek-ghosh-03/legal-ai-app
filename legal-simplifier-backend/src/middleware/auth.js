import jwt from "jsonwebtoken";

const JWT_SECRET = "secret";

export const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = header.split(" ")[1]; 

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};