import mongoose from "mongoose";
import withUser from "../plugins/withUser.js";

const ColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String },
    hex: { type: String },
    multiple: { type: Boolean, default: false },
    clearColor: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ColorSchema.plugin(withUser);
ColorSchema.index({ user: 1, name: 1, code: 1 }, { unique: true });

export const Color = mongoose.model("Color", ColorSchema);
