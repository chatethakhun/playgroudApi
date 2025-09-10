import express from "express";
import * as workoutController from "../controllers/workoutController.js";
const workOutRouter = express.Router();

workOutRouter.get("/workouts", workoutController.getListWorkout);
workOutRouter.post("/workouts", workoutController.createWorkout);
workOutRouter.get("/workouts/:id", workoutController.getSingleWorkout);
workOutRouter.put("/workouts/:id", workoutController.updateWorkout);
workOutRouter.delete("/workouts/:id", workoutController.deleteWorkout);

module.exports = workOutRouter;
