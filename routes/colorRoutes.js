import { Router } from "express";

import {
  createColor,
  getColors,
  getColor,
  updateColor,
  deleteColor,
} from "../controllers/colorController.js";
import { protectedRoute } from "../middleware/auth.js";

const colorRouter = Router();

colorRouter.post("/", protectedRoute, createColor);

colorRouter.get("/", protectedRoute, getColors);

colorRouter.get("/:id", protectedRoute, getColor);

colorRouter.put("/:id", protectedRoute, updateColor);

colorRouter.delete("/:id", protectedRoute, deleteColor);

export default colorRouter;
