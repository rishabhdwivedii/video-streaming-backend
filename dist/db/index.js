"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Videos = exports.Users = void 0;
const mongoose = require("mongoose");
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
exports.Users = mongoose.model("Users", usersSchema);
exports.Videos = mongoose.model("Videos", videosSchema);
