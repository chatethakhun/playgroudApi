import { readFile } from "fs/promises";
import path from "path";
import { jsonETag } from "../utils/getLocale.js";

export const getTranslates = async (req, res) => {
  const { lng, ns } = req.params;
  try {
    const filePath = path.join(process.cwd(), "locales", lng, `${ns}.json`);
    const raw = await readFile(filePath, "utf8");
    const data = JSON.parse(raw);

    const etag = jsonETag(data);
    res.setHeader("ETag", etag);
    res.setHeader("Cache-Control", "public, max-age=300"); // 5 นาที

    // ถ้า client ส่ง If-None-Match ตรง → ตอบ 304
    if (req.headers["if-none-match"] === etag) return res.status(304).end();

    return res.json(data);
  } catch (e) {
    return res.status(404).json({ error: "locale not found" });
  }
};
