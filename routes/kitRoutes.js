import { Router } from "express";
import {
  createKit,
  getKit,
  getKits,
  createKitRunner,
  getKitRunners,
  createSubassembly,
  getKitSubassemblies,
  getKitParts,
} from "../controllers/kitController.js";
import { protectedRoute } from "../middleware/auth.js";

const kitRouter = Router();

kitRouter.post("/", protectedRoute, createKit);

kitRouter.get("/", protectedRoute, getKits);

kitRouter.get("/:id", protectedRoute, getKit);

kitRouter.post("/:id/runner", protectedRoute, createKitRunner);

kitRouter.get("/:id/runner", protectedRoute, getKitRunners);

// subassemblies
kitRouter.post("/:id/subassembly", protectedRoute, createSubassembly);

kitRouter.get("/:id/subassembly", protectedRoute, getKitSubassemblies);

kitRouter.get("/:id/parts", protectedRoute, getKitParts);

export default kitRouter;
