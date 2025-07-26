import express from "express";

const uploadRouter = express.Router();

import { upload } from "../controllers/uploadController.js";

uploadRouter.post("/upload", upload);

export default uploadRouter;
