import express from "express";
import {
  startWorkoutSession,
  endWorkoutSession,
  getListWorkoutSession,
  deleteWorkoutSession,
  getSingleWorkoutSession,
} from "../controllers/workoutSessionController.js";
import { protectedRoute } from "../middleware/auth.js";

const workoutRouter = express.Router();

workoutRouter.get("/list", protectedRoute, getListWorkoutSession);
workoutRouter.get("/:id", protectedRoute, getSingleWorkoutSession);
workoutRouter.post("/start", protectedRoute, startWorkoutSession);
workoutRouter.put("/end/:id", protectedRoute, endWorkoutSession);
workoutRouter.delete("/:id", protectedRoute, deleteWorkoutSession);

export default workoutRouter;
