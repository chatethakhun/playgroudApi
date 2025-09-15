import { connectDb } from "../libs/mongoose.js";
import mongoose from "mongoose";
const COLLECTION = "parts";
import "dotenv/config";

async function up(db) {
  // หา parts ที่ requires มี array แต่ element ยังไม่มี isCut
  const cursor = db
    .collection(COLLECTION)
    .find(
      { requires: { $exists: true, $type: "array", $ne: [] } },
      { projection: { requires: 1 } },
    );

  let updated = 0;
  while (await cursor.hasNext()) {
    const doc = await cursor.next();

    const newRequires = doc.requires.map((r) => {
      if (typeof r.isCut === "undefined") {
        return { ...r, isCut: false };
      }
      return r;
    });

    const changed =
      JSON.stringify(newRequires) !== JSON.stringify(doc.requires);
    if (changed) {
      await db
        .collection(COLLECTION)
        .updateOne({ _id: doc._id }, { $set: { requires: newRequires } });
      updated++;
    }
  }

  console.log(`Updated ${updated} parts → added isCut=false where missing`);
}

async function down(db) {
  // ลบ field isCut ออกจากทุก requires (rollback)
  const cursor = db
    .collection(COLLECTION)
    .find(
      { requires: { $exists: true, $type: "array", $ne: [] } },
      { projection: { requires: 1 } },
    );

  let updated = 0;
  while (await cursor.hasNext()) {
    const doc = await cursor.next();

    const newRequires = doc.requires.map((r) => {
      if ("isCut" in r) {
        const { isCut, ...rest } = r;
        return rest;
      }
      return r;
    });

    const changed =
      JSON.stringify(newRequires) !== JSON.stringify(doc.requires);
    if (changed) {
      await db
        .collection(COLLECTION)
        .updateOne({ _id: doc._id }, { $set: { requires: newRequires } });
      updated++;
    }
  }

  console.log(`Rollback: removed isCut from ${updated} parts`);
}

const direction = process.argv[2] || "up";
const mongooseInstance = await mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/test",
);
const closeMongo = async () => {
  await mongooseInstance.connection.close();
};
const db = mongooseInstance.connection.db;

try {
  if (direction === "up") await up(db);
  else await down(db);
} finally {
  await closeMongo();
}
