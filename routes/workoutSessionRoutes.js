import express from "express";
import {
  startWorkoutSession,
  endWorkoutSession,
  getListWorkoutSession,
  deleteWorkoutSession,
} from "../controllers/workoutSessionController.js";
import { protectedRoute } from "../middleware/auth.js";

const workoutRouter = express.Router();

workoutRouter.get("/list", getListWorkoutSession);
workoutRouter.post("/start", protectedRoute, startWorkoutSession);
workoutRouter.put("/end/:id", protectedRoute, endWorkoutSession);
workoutRouter.delete("/end/:id", protectedRoute, deleteWorkoutSession);

export default workoutRouter;
