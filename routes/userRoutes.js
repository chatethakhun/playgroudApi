import express from "express";
import {
  signUp,
  login,
  updateProfile,
  checkAuth,
  updateAvatar,
} from "../controllers/userController.js";
import { protectedRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectedRoute, updateProfile);
userRouter.get("/me", protectedRoute, checkAuth);
userRouter.patch("/update-avatar", protectedRoute, updateAvatar);

// comment
export default userRouter;
