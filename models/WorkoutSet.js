import mongoose from "mongoose";

export const workoutSetSchema = new mongoose.Schema(
  {
    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
      required: true,
      alias: "workout",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        // ลบของเดิมออก ให้เหลือแต่ 'template'
        if (ret.workoutId !== undefined) delete ret.workoutId;
        if (ret._id !== undefined) delete ret._id;
        return { ...ret };
      },
    },
    toObject: { virtuals: true },
  },
);

export default mongoose.model("WorkoutSet", workoutSetSchema);
