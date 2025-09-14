import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    fullName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.plugin(mongooseAutoPopulate);
const User = mongoose.model("User", userSchema);

export default User;
