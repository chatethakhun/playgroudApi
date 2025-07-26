import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const uploadRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

uploadRouter.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const stream = cloudinary.uploader.upload_stream(
    { resource_type: "auto" },
    (error, result) => {
      if (error) {
        console.error("❌ Cloudinary error:", error);
        return res.status(500).json({ error: "Cloudinary upload failed" });
      }

      if (!result) {
        return res.status(500).json({ error: "No result from Cloudinary" });
      }

      return res.status(200).json({
        public_id: result.public_id,
        url: result.secure_url,
      });
    },
  );

  try {
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    console.error("❌ Streamifier error:", err);
    return res.status(500).json({ error: "Stream processing failed" });
  }
});

export default uploadRouter;
