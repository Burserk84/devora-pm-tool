import express, { Request, Response } from "express";
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
const httpServer = createServer(app); // <-- Create an HTTP server
const io = new Server(httpServer, {
  // <-- Initialize Socket.IO server
  cors: {
    origin: "http://localhost:3002",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/projects", protect, projectRouter);
app.use("/api/tasks", protect, taskRouter);
app.use("/api/users", protect, userRouter);
app.use("/api/notifications", protect, notificationRouter);
app.use("/api/admin", protect, adminRouter);

// --- REAL-TIME CHAT LOGIC ---
io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  // Event for a user to join a project-specific chat room
  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`User ${socket.id} joined project room: ${projectId}`);
  });

  // Event for a user sending a message
  socket.on("sendMessage", async ({ projectId, content, userId }) => {
    try {
      // Save the message to the database
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
      // Broadcast the new message to everyone in the project room
      io.in(projectId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Failed to save or broadcast message", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔥 A user disconnected:", socket.id);
  });
});

// We now listen on the httpServer, not the Express app
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
