import mongoose from "mongoose";
import { Part } from "../models/Part.js";

import "dotenv/config";
console.log("Removing part name from part");

await mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/test",
);

await Part.updateMany({}, { $unset: { name: 1 } });

console.log("done");

process.exit();
