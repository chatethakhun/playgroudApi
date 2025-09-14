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

export const createPart = async (req, res) => {
  try {
    const { kit, subassembly, requires = [] } = req.body;
    await assertOwnership({
      userId: req.user.id,
      kitId: kit,
      subId: subassembly,
      runnerIds: requires.map((r) => r.runner),
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
