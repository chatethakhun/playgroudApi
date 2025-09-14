import mongoose from "mongoose";
import withUser from "../plugins/withUser.js";

const PaintSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    code: { type: String, required: true },
    name: { type: String },
    note: { type: String },
  },
  { timestamps: true },
);

PaintSchema.plugin(withUser);
PaintSchema.index({ user: 1, brand: 1, code: 1 }, { unique: true });

export const Paint = mongoose.model("Paint", PaintSchema);
