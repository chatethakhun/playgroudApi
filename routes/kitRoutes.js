import { Router } from "express";
import { createKit, getKits } from "../controllers/kitController.js";
import { protectedRoute } from "../middleware/auth.js";

const kitRouter = Router();

kitRouter.post("/", protectedRoute, createKit);

kitRouter.get("/", protectedRoute, getKits);

export default kitRouter;
