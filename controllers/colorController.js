import { Color } from "../models/Color.js";

export const getColors = async (req, res) => {
  const colors = await Color.find().forUser(req.user.id).lean();
  res.json(colors);
};

export const createColor = async (req, res) => {
  try {
    const color = await Color.create({ ...req.body, user: req.user.id });
    res.status(201).json(color);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
