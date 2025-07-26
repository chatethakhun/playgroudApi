import express from "express";
import multer from "multer";
const uploadRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

uploadRouter.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  cloudinary.uploader
    .upload_stream({ resource_type: "auto" }, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Error uploading to Cloudinary" });
      }
      res.json({ public_id: result.public_id, url: result.secure_url });
    })
    .end(req.file.buffer);
});

export default uploadRouter;
