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

const Users = mongoose.model("Users", usersSchema);
const Videos = mongoose.model("Videos", videosSchema);

module.exports = {
  Users,
  Videos,
};
