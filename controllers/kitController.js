import { Kit } from "../models/Kit.js";

export const createKit = async (req, res) => {
  try {
    const kit = await Kit.create({ ...req.body, user: req.user.id });
    res.status(201).json(kit);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getKits = async (req, res) => {
  const kits = await Kit.find().forUser(req.user.id).lean();
  res.json(kits);
};

export const getKit = async (req, res) => {
  const kit = await Kit.findOne({ _id: req.params.id })
    .forUser(req.user.id)
    .lean();
  if (!kit) return res.status(404).json({ error: "Not found" });
  res.json(kit);
};
