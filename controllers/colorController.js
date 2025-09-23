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

export const getColor = async (req, res) => {
  const color = await Color.findById(req.params.id).forUser(req.user.id).lean();
  if (!color) {
    res.status(404).json({ error: "Color not found" });
  } else {
    res.json(color);
  }
};

export const updateColor = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id)
      .forUser(req.user.id)
      .lean();
    if (!color) {
      res.status(404).json({ error: "Color not found" });
    } else {
      const updatedColor = await Color.findByIdAndUpdate(req.params.id, {
        ...req.body,
        user: req.user.id,
      });
      res.json(updatedColor);
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deleteColor = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id)
      .forUser(req.user.id)
      .lean();
    if (!color) {
      res.status(404).json({ error: "Color not found" });
    } else {
      const deletedColor = await Color.findByIdAndDelete(req.params.id);
      res.json(deletedColor);
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
