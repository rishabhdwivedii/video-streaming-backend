"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/me", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.user &&
        typeof req.headers.user === "object" &&
        "username" in req.headers.user) {
        res.json({
            username: req.headers.user.username,
        });
    }
    else {
        res.status(400).json({ error: "Invalid user information in the headers" });
    }
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log("Received signup request with username:", username);
    if (yield db_1.Users.findOne({ username })) {
        res.status(403).send("User already exists.");
    }
    else {
        yield db_1.Users.create({ username, password });
        let token = (0, auth_1.generateJwt)({ username, password });
        res.json({ message: "Admin created successfully", token });
    }
}));
router.post("/login", auth_1.userAuthentication, (req, res) => {
    const loginUser = req.body;
    let token = (0, auth_1.generateJwt)(loginUser);
    res.json({ message: "Login Successful", token });
});
router.get("/", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videoData = yield db_1.Videos.find();
        res.json(videoData);
    }
    catch (error) {
        console.error("Error fetching video data:", error);
        res.status(500).send("Internal Server Error");
    }
}));
router.get("/:videoName", auth_1.authenticateJwt, (req, res) => {
    const videoName = req.params.videoName;
    const videoPath = `videos/${videoName}`;
    res.sendFile(videoPath, { root: __dirname });
});
router.post("/upload", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, thumbnail, video } = req.body;
        const newVideo = new db_1.Videos({ title, thumbnail, video });
        yield newVideo.save();
        res.status(201).json({ message: "Video data uploaded successfully" });
    }
    catch (error) {
        console.error("Error uploading video data:", error);
        res.status(500).send("Internal Server Error");
    }
}));
exports.default = router;
