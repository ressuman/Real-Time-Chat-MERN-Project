const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = express();

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

//app.use(cors());
// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_BASE_URL ||
    "https://ressuman-real-time-chat-mern-client-app.vercel.app",
]; // Add more origins if needed

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies/sessions if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const server = require("http").createServer(app);

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "https://ressuman-real-time-chat-mern-client-app.vercel.app/",
//     methods: ["GET", "POST"],
//   },
// });

const io = require("socket.io")(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the QuikChat Chat App API",
    documentation: "visit /api-docs for more info",
  });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

const onlineUser = []; // List to track online users

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // User joins a room
  socket.on("join-room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  // Handle user login and add to the online user list
  socket.on("user-login", (userId) => {
    if (!onlineUser.includes(userId)) {
      onlineUser.push(userId);
    }

    console.log(`User logged in: ${userId}`);
    console.log("Online Users:", onlineUser);

    // Broadcast updated online users to all clients
    io.emit("online-users", onlineUser);
  });

  // Handle message sending
  socket.on("send-message", (message) => {
    io.to(message.members[0])
      .to(message.members[1])
      .emit("receive-message", message);

    io.to(message.members[0])
      .to(message.members[1])
      .emit("set-message-count", message);
  });

  // Clear unread messages
  socket.on("clear-unread-messages", (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit("message-count-cleared", data);
  });

  // User typing event
  socket.on("user-typing", (data) => {
    io.to(data.members[0]).to(data.members[1]).emit("started-typing", data);
  });

  // Handle user logout or manual offline event
  socket.on("user-offline", (userId) => {
    const index = onlineUser.indexOf(userId);
    if (index > -1) {
      onlineUser.splice(index, 1);
    }

    console.log(`User went offline: ${userId}`);
    console.log("Updated Online Users:", onlineUser);

    // Notify all clients about updated online users
    io.emit("online-users-updated", onlineUser);
  });

  // Handle socket disconnect
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    // Clean up the user from the onlineUser list
    // This assumes a way to track userId related to the socket
  });
});

module.exports = server;
