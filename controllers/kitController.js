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
    .populate({ path: "color", select: "name code hex" })
    .lean();
  res.json(runners);
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
  res.json(
    await Subassembly.find({ kit: req.params.id }).sort({ order: 1 }).lean(),
  );
};

export const getKitParts = async (req, res) => {
  const parts = await Part.find({ kit: req.params.id })
    .populate({ path: "subassembly", select: "key name order" })
    .populate({
      path: "requires.runner",
      select: "code color qty",
      populate: { path: "color", select: "name hex" },
    })
    .lean();
  res.json(parts);
};
