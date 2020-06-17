const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const VideoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  video_path: {
    type: String,
    required: true,
  },
  video_name: {
    type: String,
    required: true,
  },
  thumbnail_path: {
    type: String,
    required: true,
  },
  thumbnail_name: {
    type: String,
    required: true,
  },
  video_key: {
    type: String,
    required: true,
  },
  thumbnail_key: {
    type: String,
    required: true,
  },
  reviews: [
    {
      negative: String,
      positive: String,
      like: Boolean,
      heardBefore: Boolean,
      date: { type: Date, default: Date.now },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});
module.exports = Video = mongoose.model("video", VideoSchema);
