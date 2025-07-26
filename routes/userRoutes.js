import express from "express";
import {
  signUp,
  login,
  updateProfile,
  checkAuth,
} from "../controllers/userController.js";
import { protectedRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectedRoute, updateProfile);
userRouter.get("/me", protectedRoute, checkAuth);

export default userRouter;
