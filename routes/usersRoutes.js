import express from "express";
import {
  changePassword,
  getUsers,
  getUser,
  changeRole,
} from "../controllers/usersController.js";
import { protectedRoute } from "../middleware/auth.js";

const usersRouter = express.Router();

usersRouter.get("/", protectedRoute, getUsers);

usersRouter.get("/:id", protectedRoute, getUser);

usersRouter.put("/change-password", protectedRoute, changePassword);

usersRouter.put("/change-role", protectedRoute, changeRole);

export default usersRouter;
