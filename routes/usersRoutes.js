import express from "express";
import { getUsers } from "../controllers/usersController.js";
import { protectedRoute } from "../middleware/auth.js";

const usersRouter = express.Router();

usersRouter.get("/", protectedRoute, getUsers);

export default usersRouter;
