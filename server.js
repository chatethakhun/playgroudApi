import express from "express";
import cors from "cors";
import { connectDb } from "./libs/mongoose.js";
import http from "http";
import "dotenv/config";
import userRouter from "./routes/userRoutes.js";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);

// initial socket connection
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store online
export const userSocketMap = {}; // { userId : socketId }

// Socket io handler
io.on("connection", (socket) => {
  console.log("Socket connected");
  const userId = socket.handshake.query.userId;
  console.log(` User id: ${userId} is connected`);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online user to all connected client
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    // Store offline
    delete userSocketMap[socket.id];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", userRouter);

await connectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
