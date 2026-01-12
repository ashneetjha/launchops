import dotenv from "dotenv";
dotenv.config(); // MUST be first

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import workRoutes from "./routes/workRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import protect from "./middleware/authMiddleware.js";

/* Connect DB */
connectDB();

const app = express();

/* Middleware */
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));

/* API Routes */
app.use("/api/auth", authRoutes);
app.use("/api/work", workRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

/* Health check */
app.get("/", (req, res) => {
  res.send("LaunchOps API Running");
});

/* JWT sanity check */
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    userId: req.userId
  });
});

/* Global error safety */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ message: "Internal server error" });
});

/* Start server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});