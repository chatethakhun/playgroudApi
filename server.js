import express from "express";
import cors from "cors";
import { connectDb } from "./libs/mongoose.js";
import http from "http";
import "dotenv/config";

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("Hello World!");
});

await connectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
