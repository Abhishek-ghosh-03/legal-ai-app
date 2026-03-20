import express from "express";
import cors from "cors";
import documentRoutes from "./routes/documentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors({
  origin: "https://legal-aii.netlify.app",
  credentials: true
}));
app.use(express.json());

app.use("/api/docs", documentRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

export default app;