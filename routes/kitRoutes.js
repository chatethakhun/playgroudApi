import { Router } from "express";
import { createKit, getKit, getKits } from "../controllers/kitController.js";
import { protectedRoute } from "../middleware/auth.js";

const kitRouter = Router();

kitRouter.post("/", protectedRoute, createKit);

kitRouter.get("/", protectedRoute, getKits);

kitRouter.get("/:id", protectedRoute, getKit);

export default kitRouter;
