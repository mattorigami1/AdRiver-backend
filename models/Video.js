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
  reviews: [
    {
      negative: String,
      possitive: String,
      like: Boolean,
      date: { type: Date, default: Date.now },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Video = mongoose.model("video", VideoSchema);

// video_path: {
//     type: String,
//     required: true
// },
// video_name: {
//   type: String,
//   required: true
// },
// thumbnail_path: {
//     type: String,
//     required: true
// },
// thumbnail_name: {
//   type: String,
//   required: true
// },
