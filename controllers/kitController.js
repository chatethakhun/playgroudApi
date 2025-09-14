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
