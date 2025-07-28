import express from "express";
import {
  getNotifications,
  markReadNotification,
} from "../controllers/notificationController.js";
import { protectedRoute } from "../middleware/auth.js";

const notificationRouter = express.Router();

notificationRouter.get("/", protectedRoute, getNotifications);
notificationRouter.post("/mark-read/:id", protectedRoute, markReadNotification);

export default notificationRouter;
