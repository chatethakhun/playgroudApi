import { Router } from "express";
import {
  createPart,
  getPart,
  getParts,
  deletePart,
  updatePart,
} from "../controllers/partController.js";
import { protectedRoute } from "../middleware/auth.js";

const partRouter = Router();

partRouter.post("/", protectedRoute, createPart);
partRouter.get("/", protectedRoute, getParts);
partRouter.get("/:id", protectedRoute, getPart);
partRouter.delete("/:id", protectedRoute, deletePart);
partRouter.put("/:id", protectedRoute, updatePart);

export default partRouter;
