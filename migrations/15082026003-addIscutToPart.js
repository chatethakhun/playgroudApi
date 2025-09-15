import mongoose from "mongoose";

import "dotenv/config";
import { Part } from "../models/Part.js";

await mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/test",
);

await Part.updateMany({}, { $set: { isCut: false } });

console.log("done");

process.exit();
