import express from "express";
import {
  changePassword,
  getUsers,
  getUser,
} from "../controllers/usersController.js";
import { protectedRoute } from "../middleware/auth.js";

const usersRouter = express.Router();

usersRouter.get("/", protectedRoute, getUsers);

usersRouter.get("/:id", protectedRoute, getUser);

usersRouter.put("/change-password", protectedRoute, changePassword);

export default usersRouter;
