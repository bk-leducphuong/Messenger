if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.development" });
}else {
  require("dotenv").config({ path: ".env.production" });
}

const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const socket = require("socket.io");
const sequelize = require("./config/db");
// const { Server } = require("socket.io");
const app = express();
app.use(cors(
  {
    origin: process.env.CLIENT_URL,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 3001;
let server = app.listen(PORT, async (req, res) => {
  try {
    await sequelize.sync({ force: false });
    console.log(`Server is listening on port ${PORT}`);
  }catch(error) {
    console.error(error);
  }
});

const io = socket(server, {
  pingTimeout: 6000,
  cors: {
    "Access-Control-Allow-Origin": "*",
    origin: process.env.CLIENT_URL,
    // credentials: true,
  },
});
io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (recievedMessage) => {
    var chat = recievedMessage.chat;
    chat.users.forEach((user) => {
      if (user == recievedMessage.sender._id) return;
      socket.in(user).emit("message recieved", recievedMessage);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
