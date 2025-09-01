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

if (!process.env.CLIENT_URL || !process.env.JWT_SECRET) {
  console.error(
    "FATAL ERROR: Missing required environment variables. Please check your .env file."
  );
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);

const allowedOrigins = ["http://localhost:3000", process.env.CLIENT_URL];

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
// server/src/index.ts

// ... other imports

// ... after io initialization

const onlineUsers = new Map<string, { userId: string; projectId: string }>();

io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  socket.on("joinProject", (projectId, userId) => {
    socket.join(projectId);
    onlineUsers.set(socket.id, { userId, projectId });

    const usersInProject = Array.from(onlineUsers.values())
      .filter((u) => u.projectId === projectId)
      .map((u) => u.userId);

    io.in(projectId).emit("update-online-users", usersInProject);
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
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);
      const usersInProject = Array.from(onlineUsers.values())
        .filter((u) => u.projectId === user.projectId)
        .map((u) => u.userId);
      io.in(user.projectId).emit("update-online-users", usersInProject);
    }
    console.log("🔥 A user disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
