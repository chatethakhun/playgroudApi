import { Kit } from "../models/Kit.js";
import { Part } from "../models/Part.js";
import { Runner } from "../models/Runner.js";
import { Subassembly } from "../models/Subassembly.js";

/** helper: populate ก้อนใหญ่ให้สวย ๆ */
const partPopulate = [
  { path: "kit", select: "name grade scale" },
  { path: "subassembly", select: "key name order" },
  {
    path: "requires.runner",
    select: "code qty color",
    populate: { path: "color", select: "name code hex" },
  },
];

/** ตรวจความเป็นเจ้าของของ ref ทั้งหมดก่อนสร้าง/แก้ไข */
async function assertOwnership({ userId, kitId, subId, runnerIds = [] }) {
  const [kit, sub] = await Promise.all([
    Kit.findOne({ _id: kitId }).forUser(userId),
    Subassembly.findOne({ _id: subId }).forUser(userId),
  ]);
  if (!kit) throw new Error("Kit not found or not owned by user");
  if (!sub) throw new Error("Subassembly not found or not owned by user");
  if (runnerIds.length) {
    const cnt = await Runner.countDocuments({
      _id: { $in: runnerIds },
    }).forUser(userId);
    if (cnt !== runnerIds.length)
      throw new Error("One or more runners not owned by user");
  }
}

const sortRunnersByCharacter = (runners) => {
  const characters = new Set(runners.map((r) => r.character));
  return runners.sort((a, b) => {
    const aChar = characters.has(a.character);
    const bChar = characters.has(b.character);
    if (aChar && !bChar) return -1;
    if (!aChar && bChar) return 1;
    return 0;
  });
};

export const createPart = async (req, res) => {
  try {
    const { kit, subassembly, requires = [] } = req.body;
    await assertOwnership({
      userId: req.user.id,
      kitId: kit,
      subId: subassembly,
      runnerIds: sortRunnersByCharacter(requires).map((r) => r.runner),
    });

    const doc = await Part.create({ ...req.body, user: req.user.id });
    const part = await Part.findById(doc._id)
      .forUser(req.user.id)
      .populate(partPopulate)
      .lean();
    res.status(201).json(part);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
export const getParts = async (req, res) => {
  const parts = await Part.find()
    .forUser(req.user.id)
    .populate(partPopulate)
    .lean();
  res.json(parts);
};

export const getPart = async (req, res) => {
  const part = await Part.findOne({ _id: req.params.id })
    .forUser(req.user.id)
    .populate(partPopulate)
    .lean();
  if (!part) return res.status(404).json({ error: "Not found" });
  res.json(part);
};

export const updatePart = async (req, res) => {
  try {
    const { id } = req.params;
    const { kit, subassembly, requires = [] } = req.body;
    await assertOwnership({
      userId: req.user.id,
      kitId: kit,
      subId: subassembly,
      runnerIds: sortRunnersByCharacter(requires).map((r) => r.runner),
    });

    const doc = await Part.findOne({ _id: id })
      .forUser(req.user.id)
      .populate(partPopulate);
    if (!doc) return res.status(404).json({ error: "Not found" });
    const payload = { ...req.body, user: req.user.id };

    await Part.findByIdAndUpdate(id, { $set: payload });
    const part = await Part.findById(id)
      .forUser(req.user.id)
      .populate(partPopulate)
      .lean();
    res.json(part);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deletePart = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Part.findOne({ _id: id })
      .forUser(req.user.id)
      .populate(partPopulate);
    if (!doc) return res.status(404).json({ error: "Not found" });
    await Part.findByIdAndDelete(id);
    res.status(204).end();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const updateCutInRequires = async (req, res) => {
  const { id, runnerId } = req.params;

  const part = await Part.findOne({ _id: id }).forUser(req.user.id);
  if (!part) return res.status(404).json({ error: "Part not found" });

  // toggle หรือ set true ก็ได้
  console.log({ part: JSON.stringify(part.requires) });
  const runnerParts = part.requires.find((r) => r.runner._id === runnerId);

  console.log({ runnerParts });
  if (!runnerParts) return res.status(404).json({ error: "Runner not found" });
  runnerParts.isCut = req.body.isCut ?? true;

  await part.save();

  res.json(part.requires[idx]);
};
