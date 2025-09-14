import mongoose from "mongoose";
import withUser from "../plugins/withUser.js";

const KitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    grade: {
      type: String,
      enum: ["EG", "HG", "RG", "MG", "PG", "Other"],
      required: true,
    },
    manufacturer: { type: String },
  },
  { timestamps: true },
);

KitSchema.plugin(withUser);
KitSchema.index({ user: 1, name: 1, grade: 1, scale: 1 }, { unique: true });

export const Kit = mongoose.model("Kit", KitSchema);
