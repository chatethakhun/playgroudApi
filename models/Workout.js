import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  workoutType: {
    type: String,
    required: true,
  },
  workoutReps: {
    type: Number,
    required: true,
  },
  workoutSets: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Workout", workoutSchema);
