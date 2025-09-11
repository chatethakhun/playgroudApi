import mongoose from "mongoose";
import WorkoutSet, { workoutSetSchema } from "./WorkoutSet.js";

const workoutSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  focus: {
    type: String,
    require: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startedAt: {
    type: Date,
    required: true,
  },
  endedAt: {
    type: Date,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  workoutSets: { type: [workoutSetSchema], default: [] },
});

export default mongoose.model("WorkoutSession", workoutSessionSchema);
