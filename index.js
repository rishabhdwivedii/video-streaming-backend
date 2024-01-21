const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const secretKey = "Secret@123";

const videosSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  thumbnail: String,
  video: String,
});

const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Users = mongoose.model("Users", usersSchema);
const Videos = mongoose.model("Videos", videosSchema);

async function startServer() {
  try {
    await mongoose.connect(
      "mongodb+srv://rishabh14121999:rishabh@cluster0.c0lkigv.mongodb.net/videos",
      { useNewUrlParser: true, useUnifiedTopology: true, dbName: "videos" }
    );
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

startServer();

const generateJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const userAuthentication = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ username, password });
  if (user) {
    next();
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
};

app.get("/me", authenticateJwt, async (req, res) => {
  res.json({
    username: req.user.username,
  });
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  console.log("Received signup request with username:", username);
  if (await Users.findOne({ username })) {
    res.status(403).send("User already exists.");
  } else {
    await Users.create({ username, password });
    let token = generateJwt({ username, password });
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/login", userAuthentication, (req, res) => {
  const loginUser = req.body;
  let token = generateJwt(loginUser);
  res.json({ message: "Login Successful", token });
});

app.get("/", authenticateJwt, async (req, res) => {
  try {
    const videoData = await Videos.find();
    res.json(videoData);
  } catch (error) {
    console.error("Error fetching video data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/:videoName", authenticateJwt, (req, res) => {
  const videoName = req.params.videoName;
  const videoPath = `videos/${videoName}`;
  res.sendFile(videoPath, { root: __dirname });
});

app.post("/upload", authenticateJwt, async (req, res) => {
  try {
    const { title, thumbnail, video } = req.body;
    const newVideo = new Videos({ title, thumbnail, video });
    await newVideo.save();
    res.status(201).json({ message: "Video data uploaded successfully" });
  } catch (error) {
    console.error("Error uploading video data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is running");
});

module.exports = app;
