import mongoose from "mongoose";

const workoutSetSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkoutSession",
    required: true,
  },
  workoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workout",
    required: true,
  },
});

export default mongoose.model("WorkoutSet", workoutSetSchema);
