import mongoose from "mongoose";

import "dotenv/config";

import User from "../models/User.js";

await mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/test",
);

await User.updateMany({}, { $set: { role: "user" } });

console.log("done");

process.exit();
