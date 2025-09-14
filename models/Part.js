import mongoose from "mongoose";
import withUser from "../plugins/withUser.js";
import mongooseAutoPopulate from "mongoose-autopopulate";

const PartRequirementSchema = new mongoose.Schema(
  {
    runner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Runner",
      required: true,
      autopopulate: true,
    },
    gate: { type: String, required: true },
    qty: { type: Number, default: 1, min: 1 },
  },
  { _id: false },
);

const PartSchema = new mongoose.Schema(
  {
    kit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kit",
      required: true,
      index: true,
      autopopulate: true,
    },
    subassembly: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subassembly",
      required: true,
      index: true,
      autopopulate: true,
    },
    code: { type: String },
    name: { type: String, required: true },
    requires: [PartRequirementSchema],
    paints: [{ type: mongoose.Schema.Types.ObjectId, ref: "Paint" }],
  },
  { timestamps: true },
);
PartSchema.plugin(mongooseAutoPopulate);
PartSchema.plugin(withUser);
PartSchema.index(
  { user: 1, kit: 1, subassembly: 1, name: 1 },
  { unique: true },
);

export const Part = mongoose.model("Part", PartSchema);
