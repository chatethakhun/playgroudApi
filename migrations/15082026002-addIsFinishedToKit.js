import mongoose from "mongoose";

import "dotenv/config";
import { Kit } from "../models/Kit.js";

await mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/test",
);

await Kit.updateMany({}, { $set: { isFinished: false } });

console.log("done");

process.exit();
