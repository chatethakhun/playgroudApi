import { Router } from "express";
import { Color } from "../models/Color.js";
import { createColor, getColors } from "../controllers/colorController.js";
import { protectedRoute } from "../middleware/auth.js";

const colorRouter = Router();

colorRouter.post("/", protectedRoute, createColor);

colorRouter.get("/", protectedRoute, getColors);

export default colorRouter;
