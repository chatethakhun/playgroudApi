import { Router } from "express";
import {
  createPart,
  getPart,
  getParts,
} from "../controllers/partController.js";
import { protectedRoute } from "../middleware/auth.js";

const partRouter = Router();

partRouter.post("/", protectedRoute, createPart);
partRouter.get("/", protectedRoute, getParts);
partRouter.get("/:id", protectedRoute, getPart);
export default partRouter;
