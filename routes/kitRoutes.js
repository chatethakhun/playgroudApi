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
  updateKitRunner,
  deleteKitRunner,
  getKitRunner,
} from "../controllers/kitController.js";
import { protectedRoute } from "../middleware/auth.js";

const kitRouter = Router();

kitRouter.post("/", protectedRoute, createKit);

kitRouter.get("/", protectedRoute, getKits);

kitRouter.get("/:id", protectedRoute, getKit);

kitRouter.post("/:id/runner", protectedRoute, createKitRunner);

kitRouter.get("/:id/runner", protectedRoute, getKitRunners);

kitRouter.get("/:id/runner/:runnerId", protectedRoute, getKitRunner);

kitRouter.put("/:id/runner/:runnerId", protectedRoute, updateKitRunner);

kitRouter.delete("/:id/runner/:runnerId", protectedRoute, deleteKitRunner);

// subassemblies
kitRouter.post("/:id/subassembly", protectedRoute, createSubassembly);

kitRouter.get("/:id/subassembly", protectedRoute, getKitSubassemblies);

kitRouter.get("/:id/parts", protectedRoute, getKitParts);

export default kitRouter;
