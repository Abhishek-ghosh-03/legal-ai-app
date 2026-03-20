import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import app from "./src/app.js";
import { connectDB } from "./src/utils/db.js";
import documentRoutes from "./src/routes/documentRoutes.js";

import statsRoutes from "./src/routes/statsRoutes.js";

const PORT = process.env.PORT || 5000;


connectDB();

app.use("/api/stats", statsRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/", documentRoutes);
app.use("/api/docs", documentRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});