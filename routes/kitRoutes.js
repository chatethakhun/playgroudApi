import { Router } from "express";
import {
  createKit,
  getKit,
  getKits,
  createKitRunner,
  getKitRunners,
  createSubassembly,
  getKitSubassemblies,
  getKitSubassembly,
  updateKitSubassembly,
  deleteKitSubassembly,
  getKitParts,
  updateKitRunner,
  deleteKitRunner,
  getKitRunner,
  updateIsFinished,
} from "../controllers/kitController.js";
import { protectedRoute } from "../middleware/auth.js";

const kitRouter = Router();

kitRouter.post("/", protectedRoute, createKit);

kitRouter.get("/", protectedRoute, getKits);

kitRouter.get("/:id", protectedRoute, getKit);

kitRouter.put("/:id/is-finished", protectedRoute, updateIsFinished);

kitRouter.post("/:id/runner", protectedRoute, createKitRunner);

kitRouter.get("/:id/runner", protectedRoute, getKitRunners);

kitRouter.get("/:id/runner/:runnerId", protectedRoute, getKitRunner);

kitRouter.put("/:id/runner/:runnerId", protectedRoute, updateKitRunner);

kitRouter.delete("/:id/runner/:runnerId", protectedRoute, deleteKitRunner);

// subassemblies
kitRouter.post("/:id/subassembly", protectedRoute, createSubassembly);

kitRouter.get("/:id/subassembly", protectedRoute, getKitSubassemblies);

kitRouter.get("/:id/subassembly/:id", protectedRoute, getKitSubassembly);

kitRouter.put("/:id/subassembly/:id", protectedRoute, updateKitSubassembly);

kitRouter.delete("/:id/subassembly/:id", protectedRoute, deleteKitSubassembly);

kitRouter.get("/:id/parts", protectedRoute, getKitParts);

export default kitRouter;
