import express from "express";
import { Users, Videos } from "../db";
import {
  authenticateJwt,
  generateJwt,
  userAuthentication,
} from "../middleware/auth";
import { z } from "zod";

const signupInput = z.object({
  username: z.string().min(1).max(30),
  password: z.string().min(6).max(30),
});

// type signupParams = z.infer<typeof signupInput>; zod inference

const router = express.Router();

router.get("/me", authenticateJwt, async (req, res) => {
  if (
    req.headers.user &&
    typeof req.headers.user === "object" &&
    "username" in req.headers.user
  ) {
    res.json({
      username: req.headers.user.username,
    });
  } else {
    res.status(400).json({ error: "Invalid user information in the headers" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = signupInput.parse(req.body);
    console.log("Received signup request with username:", username);
    if (await Users.findOne({ username })) {
      res.status(403).send("User already exists.");
    } else {
      await Users.create({ username, password });
      let token = generateJwt({ username, password });
      res.json({ message: "Admin created successfully", token });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error("Error during signup:", error);
      res.status(500).send("Internal Server Error");
    }
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

export default router;
