import mongoose from "mongoose";
import withUser from "../plugins/withUser.js";
import mongooseAutoPopulate from "mongoose-autopopulate";

const SubassemblySchema = new mongoose.Schema(
  {
    kit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kit",
      required: true,
      index: true,
      autopopulate: true,
    },
    key: { type: String, required: true },
    name: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

SubassemblySchema.plugin(mongooseAutoPopulate);
SubassemblySchema.plugin(withUser);
SubassemblySchema.index({ user: 1, kit: 1, key: 1 }, { unique: true });

export const Subassembly = mongoose.model("Subassembly", SubassemblySchema);
