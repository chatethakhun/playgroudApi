import express from "express";
import cors from "cors";
import { connectDb } from "./libs/mongoose.js";
import http from "http";
import "dotenv/config";

import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);

import userRouter from "./routes/userRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import usersRouter from "./routes/usersRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import WS_EVENT from "./constant/wsEvent.js";
import workoutSessionRouter from "./routes/workoutSessionRoutes.js";
import workOutRouter from "./routes/workoutRoutes.js";

// initial socket connection
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store online
export const userSocketMap = {}; // { userId : socketId }
// SOCKET.IO HANDLER

// Socket io handler
io.on("connection", (socket) => {
  console.log("Socket connected");
  const userId = socket.handshake.query.userId;
  console.log(` User id: ${userId} is connected`);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online user to all connected client
  io.emit(WS_EVENT.GET_ONLINE_USERS, Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    // Store offline
    delete userSocketMap[socket.id];
    io.emit(WS_EVENT.GET_ONLINE_USERS, Object.keys(userSocketMap));
  });
});

app.use(express.json({ limit: "4mb" }));
app.use(
  cors({
    origin: "*",
    headers: ["Content-Type"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/status", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", userRouter);
app.use("/api/file", uploadRouter);
app.use("/api/message", messageRouter);
app.use("/api/users", usersRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/workout-session", workoutSessionRouter);
app.use("/api/workouts", workOutRouter);

await connectDb();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
