import mongoose from "mongoose";

import "dotenv/config";

import { Color } from "../models/Color.js";

await mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/test",
);

await Color.updateMany({}, { $set: { clearColor: false } });

console.log("done");

process.exit();
