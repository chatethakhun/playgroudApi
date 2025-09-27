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
  // sort with is cut and runner name
  const runners = await Runner.find({ kit: req.params.id })
    .forUser(req.user.id)
    .populate({ path: "color", select: "name code hex multiple clearColor" })
    .sort({ isCut: 1, code: 1 })
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

export const getKitSubassembly = async (req, res) => {
  const sub = await Subassembly.findOne({ _id: req.params.id })
    .forUser(req.user.id)
    .populate({ path: "kit", select: "name" })
    .lean();
  if (!sub) return res.status(404).json({ error: "Subassembly not found" });
  res.json(sub);
};

export const updateKitSubassembly = async (req, res) => {
  try {
    const sub = await Subassembly.findOne({ _id: req.params.id }).forUser(
      req.user.id,
    );
    if (!sub) return res.status(404).json({ error: "Subassembly not found" });

    const newSub = await Subassembly.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
      },
      { new: true },
    );
    res.status(200).json(newSub);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deleteKitSubassembly = async (req, res) => {
  try {
    const sub = await Subassembly.findOne({ _id: req.params.id }).forUser(
      req.user.id,
    );
    if (!sub) return res.status(404).json({ error: "Subassembly not found" });

    await Subassembly.deleteOne({ _id: req.params.id });
    res.status(200).json(sub);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getKitParts = async (req, res) => {
  try {
    const kitId = new mongoose.Types.ObjectId(req.params.id);
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const parts = await Part.aggregate([
      // filter ตาม kit + user
      { $match: { kit: kitId, user: userId } },
      // sort ตาม createdAt
      { $sort: { createdAt: 1 } },
      // populate subassembly
      {
        $lookup: {
          from: "subassemblies",
          localField: "subassembly",
          foreignField: "_id",
          as: "subassembly",
        },
      },
      { $unwind: { path: "$subassembly", preserveNullAndEmptyArrays: true } },

      // แตก requires array
      { $unwind: { path: "$requires", preserveNullAndEmptyArrays: true } },

      // lookup runner
      {
        $lookup: {
          from: "runners",
          localField: "requires.runner",
          foreignField: "_id",
          as: "runner",
        },
      },
      { $unwind: { path: "$runner", preserveNullAndEmptyArrays: true } },

      // lookup runner.color
      {
        $lookup: {
          from: "colors",
          localField: "runner.color",
          foreignField: "_id",
          as: "runnerColor",
        },
      },
      { $unwind: { path: "$runnerColor", preserveNullAndEmptyArrays: true } },

      // sort ตาม runner.code
      { $sort: { "runner.code": 1 } },

      // group กลับเป็น part เดียว
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
          requires: {
            $push: {
              runner: {
                _id: "$runner._id",
                code: "$runner.code",
                qty: "$runner.qty",
                isCut: "$runner.isCut",
                pieces: "$runner.pieces", // ✅ จะมี gate อยู่ในนี้
                color: {
                  _id: "$runnerColor._id",
                  name: "$runnerColor.name",
                  hex: "$runnerColor.hex",
                  code: "$runnerColor.code",
                  multiple: "$runnerColor.multiple",
                  clearColor: "$runnerColor.clearColor",
                },
              },
              gate: "$requires.gate", // จาก Part.requires
              qty: "$requires.qty",
              isCut: "$requires.isCut",
            },
          },
        },
      },

      // final shape
      {
        $project: {
          _id: 1,
          kit: "$doc.kit",
          name: "$doc.name",
          code: "$doc.code",
          subassembly: {
            _id: "$doc.subassembly._id",
            key: "$doc.subassembly.key",
            name: "$doc.subassembly.name",
            order: "$doc.subassembly.order",
          },
          requires: 1,
          paints: "$doc.paints",
          createdAt: "$doc.createdAt",
          updatedAt: "$doc.updatedAt",
          isCut: "$doc.isCut",
        },
      },
    ]);

    res.json(parts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
