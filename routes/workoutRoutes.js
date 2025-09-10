import express from "express";
import * as workoutController from "../controllers/workoutController.js";
const workOutRouter = express.Router();

workOutRouter.get("/list", workoutController.getListWorkout);
workOutRouter.post("/create", workoutController.createWorkout);
workOutRouter.get("/:id", workoutController.getSingleWorkout);
workOutRouter.put("/:id", workoutController.updateWorkout);
workOutRouter.delete("/:id", workoutController.deleteWorkout);

module.exports = workOutRouter;
