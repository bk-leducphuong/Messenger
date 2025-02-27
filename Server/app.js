import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import sequelize from './config/db.js';

// Configure environment variables
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.development" });
} else {
  dotenv.config({ path: ".env.production" });
}

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(cookieParser());

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(`Server is listening on port ${PORT}`);
  } catch(error) {
    console.error(error);
  }
});

const io = new Server(server, {
  pingTimeout: 6000,
  cors: {
    "Access-Control-Allow-Origin": "*",
    origin: process.env.CLIENT_URL,
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    socket.join(user.user_id);
    socket.emit("connected");
  });

  socket.on("join chat", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("new message", (recievedMessage) => {
    const chat = recievedMessage.chat;
    chat.users.forEach((user) => {
      if (user == recievedMessage.sender._id) return;
      socket.in(user).emit("message recieved", recievedMessage);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
