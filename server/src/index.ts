import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import prisma from "./lib/prisma";
import { protect } from "./middlewares/auth.middleware";

// Routers
import authRouter from "./modules/auth/auth.router";
import projectRouter from "./modules/project/project.router";
import taskRouter from "./modules/task/task.router";
import userRouter from "./modules/user/user.router";
import notificationRouter from "./modules/notification/notification.router";
import adminRouter from "./modules/admin/admin.router";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// FIX: Allow both development and production frontend URLs to connect
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL, // This should be https://app.devorastudio.ir in your .env file
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// FIX: Removed the redundant '/api' prefix from all routes
app.use("/auth", authRouter);
app.use("/projects", protect, projectRouter);
app.use("/tasks", protect, taskRouter);
app.use("/users", protect, userRouter);
app.use("/notifications", protect, notificationRouter);
app.use("/admin", protect, adminRouter);

// --- REAL-TIME CHAT LOGIC (No changes needed here) ---
io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`User ${socket.id} joined project room: ${projectId}`);
  });

  socket.on("sendMessage", async ({ projectId, content, userId }) => {
    try {
      const newMessage = await prisma.message.create({
        data: {
          content,
          projectId,
          userId,
        },
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      });
      io.in(projectId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Failed to save or broadcast message", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔥 A user disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
