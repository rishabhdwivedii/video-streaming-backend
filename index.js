const express = require("express");
const fs = require("fs");

const app = express();
app.use("/videos", express.static("videos"));

app.get("/", (req, res) => {
  const videosFolder = "videos";
  fs.readdir(videosFolder, (err, files) => {
    if (err) {
      console.error("Error reading video files:", err);
      return res.status(500).send("Internal Server Error");
    }

    const videoNames = files.filter((file) => file.endsWith(".mp4"));
    res.json({ videoNames });
  });
});

app.get("/:videoName", (req, res) => {
  const videoName = req.params.videoName;
  const videoPath = `videos/${videoName}`;
  res.sendFile(videoPath, { root: __dirname });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running");
});

module.exports = app;
