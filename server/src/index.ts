import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./modules/auth/auth.router";
import projectRouter from "./modules/project/project.router";
import { protect } from "./middlewares/auth.middleware";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow server to accept JSON in request body

// A simple test route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP" });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/projects", protect, projectRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
