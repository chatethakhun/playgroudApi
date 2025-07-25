import express from "express";
import {
  getMessages,
  markMessageAsSeen,
} from "../controllers/messageController.js";
import { protectedRoute } from "../middleware/auth.js";
const messageRouter = express.Router();

messageRouter.get("/:id", protectedRoute, getMessages);

messageRouter.post("/:id/seen", protectedRoute, markMessageAsSeen);

export default messageRouter;
