import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET missing in env");
      return res.status(500).json({ message: "Server misconfigured" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user id to request
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protect;
