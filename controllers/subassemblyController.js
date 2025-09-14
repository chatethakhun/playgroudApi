import { Part } from "../models/Part.js";
import mongoose from "mongoose";

export const subassembliesBom = async (req, res) => {
  // รวมจำนวนที่ “ต้องใช้จริง” ของเกท/แผงสำหรับ subassembly นี้
  const subId = new mongoose.Types.ObjectId(req.params.id);

  const agg = await Part.aggregate([
    { $match: { subassembly: subId } },
    { $unwind: "$requires" },
    {
      $group: {
        _id: { runner: "$requires.runner", gate: "$requires.gate" },
        totalQty: { $sum: "$requires.qty" },
      },
    },
    {
      $lookup: {
        from: "runners",
        localField: "_id.runner",
        foreignField: "_id",
        as: "runner",
      },
    },
    { $unwind: "$runner" },
    {
      $lookup: {
        from: "colors",
        localField: "runner.color",
        foreignField: "_id",
        as: "color",
      },
    },
    { $unwind: { path: "$color", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        runnerCode: "$runner.code",
        gate: "$_id.gate",
        totalQty: 1,
        runnerQtyInBox: "$runner.qty",
        colorName: "$color.name",
        colorHex: "$color.hex",
      },
    },
    { $sort: { runnerCode: 1, gate: 1 } },
  ]);

  res.json(agg);
};
