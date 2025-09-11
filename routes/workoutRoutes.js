import express from "express";
import * as workoutController from "../controllers/workoutController.js";
import { protectedRoute } from "../middleware/auth.js";
const workOutRouter = express.Router();

workOutRouter.get("/list", protectedRoute, workoutController.getListWorkout);
workOutRouter.post("/create", protectedRoute, workoutController.createWorkout);
workOutRouter.get("/:id", protectedRoute, workoutController.getSingleWorkout);
workOutRouter.put("/:id", protectedRoute, workoutController.updateWorkout);
workOutRouter.delete("/:id", protectedRoute, workoutController.deleteWorkout);

export default workOutRouter;
