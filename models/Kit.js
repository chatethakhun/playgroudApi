import mongoose from "mongoose";
import withUser from "../plugins/withUser.js";

const KitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    grade: {
      type: String,
      enum: ["EG", "HG", "RG", "MG", "PG", "Other", "MGSD"],
      required: true,
    },
    manufacturer: { type: String },
    isFinished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

KitSchema.plugin(withUser);
KitSchema.index({ user: 1, name: 1, grade: 1, scale: 1 }, { unique: true });

KitSchema.virtual("runners", {
  ref: "Runner",
  localField: "_id",
  foreignField: "kit",
  justOne: false,
});

export const Kit = mongoose.model("Kit", KitSchema);
