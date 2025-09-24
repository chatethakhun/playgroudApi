import mongoose from "mongoose";

import "dotenv/config";

import { Runner } from "../models/Runner.js";

await mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/test",
);

await Runner.updateMany({}, { $set: { isCut: false } });

console.log("done");

process.exit();
