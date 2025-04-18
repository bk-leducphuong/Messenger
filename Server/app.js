import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { sequelize } from "./model/index.js";

// Configure environment variables
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.development" });
} else {
  dotenv.config({ path: ".env.production" });
}

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/search", searchRoutes);

const PORT = parseInt(process.env.PORT) || 3001;
const HOST_NAME = process.env.HOST_NAME || "localhost";
const server = app.listen(PORT, HOST_NAME, async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(`Server is listening on port ${PORT}`);
  } catch (error) {
    console.error(error);
  }
});

const io = new Server(server, {
  pingTimeout: 6000,
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

// Track online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  // Add user:activity handler
  socket.on("user:activity", ({ userId, status }) => {
    if (status === "online") {
      onlineUsers.set(userId, socket.id);
    } else {
      onlineUsers.delete(userId);
    }

    // Broadcast user status to all connected clients
    io.emit("user:status", {
      userId,
      status,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("join conversation", (conversationId) => {
    socket.join(`conversation:${conversationId}`);
  });

  socket.on("message:send", (message) => {
    socket
      .in(`conversation:${message.conversation_id}`)
      .emit("message:new", message);
  });

  // Handle typing event
  socket.on("typing:start", ({ conversationId, user }) => {
    // console.log("typing:start", { conversationId, user });
    // Broadcast to all users in the conversation room except sender
    socket.to(conversationId).emit("typing:update", {
      conversationId,
      userId: user.user_id,
      userName: user.username,
      isTyping: true,
    });
  });

  // Optional: Add typing stop event
  socket.on("typing:stop", ({ conversationId, user }) => {
    socket.to(conversationId).emit("typing:update", {
      conversationId,
      userId: user.user_id,
      userName: user.username,
      isTyping: false,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:");
  });

  // Handle call initiation
  socket.on("call:start", ({ caller, offer, callType, receiverId }) => {
    const recieverSocketId = onlineUsers.get(receiverId);
    if (recieverSocketId) {
      socket.to(recieverSocketId).emit("call:incoming", {
        offer,
        callType,
        callerId: caller.user_id,
        callerName: caller.username,
      });
    }
  });

  // Handle call acceptance
  socket.on("call:accept", ({ answer, callerId }) => {
    const callerSocketId = onlineUsers.get(callerId);
    if (callerSocketId) {
      socket.to(callerSocketId).emit("call:accepted", { answer });
    }
  });

  // Handle call rejection
  socket.on("call:reject", ({ callerId }) => {
    const callerSocketId = onlineUsers.get(callerId);
    if (callerSocketId) {
      socket.to(callerSocketId).emit("call:rejected");
    }
  });

  // Handle call end
  socket.on("call:end", ({ receiverId }) => {
    const recieverSocketId = onlineUsers.get(receiverId);
    if (recieverSocketId) {
      socket.to(recieverSocketId).emit("call:ended");
    }
  });

  // Handle ICE candidates
  socket.on("call:ice-candidate", ({ candidate, receiverId }) => {
    const recieverSocketId = onlineUsers.get(receiverId);
    if (recieverSocketId) {
      socket.to(recieverSocketId).emit("call:ice-candidate", { candidate });
    }
  });
});
