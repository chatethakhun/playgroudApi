import express from "express";
import {
  getMessages,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageController.js";
import { protectedRoute } from "../middleware/auth.js";
const messageRouter = express.Router();

messageRouter.get("/:id", protectedRoute, getMessages);
messageRouter.post("/mark/:id", protectedRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectedRoute, sendMessage);
export default messageRouter;
