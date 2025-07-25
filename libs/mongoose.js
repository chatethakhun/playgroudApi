import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("MongoDB connected"));
    mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/test",
    );
  } catch (error) {
    console.log(error);
  }
};
