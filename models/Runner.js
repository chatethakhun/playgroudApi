import mongoose from "mongoose";
import withUser from "../plugins/withUser.js";
import mongooseAutoPopulate from "mongoose-autopopulate";

const RunnerPieceSchema = new mongoose.Schema(
  {
    gate: { type: String, required: true },
    label: { type: String },
  },
  { _id: false },
);

const RunnerSchema = new mongoose.Schema(
  {
    kit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kit",
      required: true,
      index: true,
      autopopulate: true,
    },
    code: { type: String, required: true },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      autopopulate: true,
    },
    qty: { type: Number, default: 1, min: 1 },
    pieces: [RunnerPieceSchema],
    isCut: { type: Boolean, default: false },
  },
  { timestamps: true },
);
RunnerSchema.plugin(mongooseAutoPopulate);
RunnerSchema.plugin(withUser);
RunnerSchema.index({ user: 1, kit: 1, code: 1 }, { unique: true });

export const Runner = mongoose.model("Runner", RunnerSchema);
