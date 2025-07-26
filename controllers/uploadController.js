import cloudinary from "../libs/cloudinary.js";

export const upload = async (req, res) => {
  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ error: "Please upload a file" });
    }

    const upload = await cloudinary.uploader.upload(file);

    res.status(200).json({ message: "File uploaded successfully", upload });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};
