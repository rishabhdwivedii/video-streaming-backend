import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import appRouter from "./routes/router";
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", appRouter);

async function startServer() {
  try {
    await mongoose.connect(process.env.DATABASE_URL!, {
      dbName: "videos",
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", (error as Error).message);
  }
}

startServer();

app.listen(process.env.PORT || 3002, () => {
  console.log("Server is running");
});

module.exports = app;
