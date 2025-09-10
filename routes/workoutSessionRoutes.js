import express from "express";
import {
  startWorkoutSession,
  endWorkoutSession,
  getListWorkoutSession,
  deleteWorkoutSession,
  getSingleWorkoutSession,
} from "../controllers/workoutSessionController.js";
import { protectedRoute } from "../middleware/auth.js";

const workoutSessionRouter = express.Router();

workoutSessionRouter.get("/list", protectedRoute, getListWorkoutSession);
workoutSessionRouter.get("/:id", protectedRoute, getSingleWorkoutSession);
workoutSessionRouter.post("/start", protectedRoute, startWorkoutSession);
workoutSessionRouter.put("/end/:id", protectedRoute, endWorkoutSession);
workoutSessionRouter.delete("/:id", protectedRoute, deleteWorkoutSession);

export default workoutSessionRouter;
