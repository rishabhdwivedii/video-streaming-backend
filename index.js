const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const app = express();
app.use("/videos", express.static("videos"));
app.use(express.json());

const videosSchema = new mongoose.Schema({
  id: Number,
  title: String,
  thumbnail: String,
  video: String,
});

const Videos = mongoose.model("Videos", videosSchema);

mongoose.connect(
  "mongodb+srv://rishabh14121999:rishabh@cluster0.y9lndvq.mongodb.net/videos",
  { useNewUrlParser: true, useUnifiedTopology: true, dbName: "videos" }
);

app.get("/api/videos", async (req, res) => {
  try {
    const videoData = await Videos.find();
    res.json(videoData);
  } catch (error) {
    console.error("Error fetching video data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/:videoName", (req, res) => {
  const videoName = req.params.videoName;
  const videoPath = `videos/${videoName}`;
  res.sendFile(videoPath, { root: __dirname });
});

app.post("/api/upload", async (req, res) => {
  try {
    const { id, title, thumbnail, video } = req.body;
    const newVideo = new Videos({ id, title, thumbnail, video });
    await newVideo.save();
    res.status(201).json({ message: "Video data uploaded successfully" });
  } catch (error) {
    console.error("Error uploading video data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});

module.exports = app;
