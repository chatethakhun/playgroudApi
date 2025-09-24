import mongoose from "mongoose";
import { Kit } from "../models/Kit.js";
import { Part } from "../models/Part.js";
import { Runner } from "../models/Runner.js";
import { Subassembly } from "../models/Subassembly.js";

export const createKit = async (req, res) => {
  try {
    const kit = await Kit.create({ ...req.body, user: req.user.id });
    res.status(201).json(kit);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getKits = async (req, res) => {
  const { isFinished } = req.query;

  const kits = await Kit.find({ isFinished: isFinished === "true" })
    .forUser(req.user.id)
    .populate({ path: "runners" })
    .lean();
  res.json(kits);
};

export const getKit = async (req, res) => {
  const kit = await Kit.findOne({ _id: req.params.id })
    .forUser(req.user.id)
    .populate({ path: "runners" })
    .lean();
  if (!kit) return res.status(404).json({ error: "Not found" });
  res.json(kit);
};

export const updateIsFinished = async (req, res) => {
  const isFinished = req.body.isFinished;
  const kit = await Kit.findOne({ _id: req.params.id }).forUser(req.user.id);
  if (!kit) return res.status(404).json({ error: "Kit not found" });

  kit.isFinished = isFinished;
  await kit.save();
  res.json(kit);
};

export const createKitRunner = async (req, res) => {
  try {
    // ตรวจสอบว่า kit เป็นของ user นี้จริง
    const kit = await Kit.findOne({ _id: req.params.id }).forUser(req.user.id);
    if (!kit) return res.status(404).json({ error: "Kit not found" });

    const runnerPieces = [];

    const runner = await Runner.create({
      ...req.body,
      kit: kit._id,
      user: req.user.id,
      pieces: runnerPieces,
    });
    res.status(201).json(runner);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getKitRunners = async (req, res) => {
  // จำกัดเฉพาะของ user นี้
  const runners = await Runner.find({ kit: req.params.id })
    .forUser(req.user.id)
    .populate({ path: "color", select: "name code hex multiple clearColor" })
    .lean();
  res.json(runners);
};
export const getKitRunner = async (req, res) => {
  const runner = await Runner.findOne({ _id: req.params.runnerId })
    .forUser(req.user.id)
    .populate({ path: "color", select: "name code hex multiple clearColor" })
    .lean();
  if (!runner) return res.status(404).json({ error: "Runner not found" });
  res.json(runner);
};

export const updateKitRunner = async (req, res) => {
  try {
    const runner = await Runner.findOne({ _id: req.params.runnerId }).forUser(
      req.user.id,
    );
    if (!runner) return res.status(404).json({ error: "Runner not found" });

    const runnerPieces = [];

    await Runner.updateOne(
      { _id: req.params.runnerId },
      {
        ...req.body,
        pieces: runnerPieces,
      },
    );
    res.status(200).json(runner);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const updateKitRunnerPieces = async (req, res) => {
  try {
    const runner = await Runner.findOne({ _id: req.params.runnerId }).forUser(
      req.user.id,
    );
    if (!runner) return res.status(404).json({ error: "Runner not found" });

    const runnerPieces = req.body.pieces;

    await Runner.updateOne(
      { _id: req.params.runnerId },
      {
        ...req.body,
        pieces: runnerPieces,
      },
    );
    res.status(200).json(runner);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deleteKitRunner = async (req, res) => {
  try {
    const runner = await Runner.findOne({ _id: req.params.runnerId }).forUser(
      req.user.id,
    );
    if (!runner) return res.status(404).json({ error: "Runner not found" });

    await Runner.deleteOne({ _id: req.params.runnerId });
    res.status(200).json(runner);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const createSubassembly = async (req, res) => {
  try {
    const kit = await Kit.findOne({ _id: req.params.id }).forUser(req.user.id);
    if (!kit) return res.status(404).json({ error: "Kit not found" });

    const sub = await Subassembly.create({
      ...req.body,
      kit: kit._id,
      user: req.user.id,
    });
    res.status(201).json(sub);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getKitSubassemblies = async (req, res) => {
  const kitId = new mongoose.Types.ObjectId(req.params.id);
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const notUsed =
    String(req.query.notUsedInPart || "").toLowerCase() === "true";
  // ถ้าไม่ใช้ตัวกรอง ก็คืนรายการปกติ (เดิม)
  if (!notUsed) {
    const subs = await Subassembly.find({ kit: kitId })
      .forUser(userId)
      .sort({ order: 1 })
      .lean();
    return res.json(subs);
  }

  // ใช้ Aggregation: match subassemblies ของคิทนี้ + ผู้ใช้นี้
  // แล้ว lookup parts ที่ชี้ subassembly นั้น (ของผู้ใช้นี้ + คิทเดียวกัน)
  const subs = await Subassembly.aggregate([
    { $match: { kit: kitId, user: userId } },
    {
      $lookup: {
        from: "parts",
        let: { subId: "$_id", kitId: "$kit", userId: "$user" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$subassembly", "$$subId"] },
                  { $eq: ["$kit", "$$kitId"] },
                  { $eq: ["$user", "$$userId"] },
                ],
              },
            },
          },
          { $limit: 1 }, // พอรู้ว่ามีสักตัวก็พอ ไม่ต้องดึงทั้งหมด
        ],
        as: "usedParts",
      },
    },
    // เก็บเฉพาะที่ "ยังไม่ถูกใช้" (ไม่มี part อ้าง subassembly นี้)
    { $match: { usedParts: { $eq: [] } } },
    { $project: { usedParts: 0 } },
    { $sort: { order: 1, _id: 1 } },
  ]);

  res.json(subs);
};

export const getKitParts = async (req, res) => {
  const parts = await Part.find({ kit: req.params.id })
    .populate({ path: "subassembly", select: "key name order" })
    .populate({
      path: "requires.runner",
      select: "code color qty",
      populate: { path: "color", select: "name hex multiple code clearColor" },
    })
    .lean();
  res.json(parts);
};
