import express from "express";
import {
  signUp,
  login,
  updateProfile,
  checkAuth,
  updateAvatar,
  changePassword,
} from "../controllers/userController.js";
import { protectedRoute } from "../middleware/auth.js";

const userRouter = express.Router();
userRouter.get("/me", protectedRoute, checkAuth);

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectedRoute, updateProfile);

userRouter.patch("/update-avatar", protectedRoute, updateAvatar);

// comment
export default userRouter;
