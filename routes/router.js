const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const { Users, Videos } = require("../db");
const {
  authenticateJwt,
  generateJwt,
  userAuthentication,
} = require("../middleware/auth");

const router = express.Router();

router.get("/me", authenticateJwt, async (req, res) => {
  res.json({
    username: req.user.username,
  });
});

router.post("/signup", async (req, res) => {
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

router.post("/login", userAuthentication, (req, res) => {
  const loginUser = req.body;
  let token = generateJwt(loginUser);
  res.json({ message: "Login Successful", token });
});

router.get("/", authenticateJwt, async (req, res) => {
  try {
    const videoData = await Videos.find();
    res.json(videoData);
  } catch (error) {
    console.error("Error fetching video data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:videoName", authenticateJwt, (req, res) => {
  const videoName = req.params.videoName;
  const videoPath = `videos/${videoName}`;
  res.sendFile(videoPath, { root: __dirname });
});

router.post("/upload", authenticateJwt, async (req, res) => {
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

module.exports = router;
