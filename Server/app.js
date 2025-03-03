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
    origin: process.env.CLIENT_URL,
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    socket.join(user.user_id);
    socket.emit("connected");
  });

  socket.on("join conversation", (conversationId) => {
    socket.join(`conversation:${conversationId}`);
  });

  socket.on("message:send", (message) => {
    socket.in(`conversation:${message.conversation_id}`).emit("message:new", message);
  });


  socket.off("setup", () => {
    // socket.leave(userData._id);
  });
});
