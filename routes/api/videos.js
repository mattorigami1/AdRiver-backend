const express = require("express");
const router = express.Router();
const multer = require("multer");
const Video = require("../../models/Video");
const makeResponse = require("../../helpers/response");
const fs = require("fs");

// const storage = multer.diskStorage({
//   destination: (req, res, cb) => {
//     cb(null, "media/uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname.replace(/ /g, "_"));
//   },
// });

// const upload = multer({
//   storage,
// });

// upload.fields([
//   { name: "video", maxCount: 1 },
//   { name: "image", maxCount: 1 },
// ]);

// video_path:
//       "http://localhost:" +
//       5000 +
//       "/api/videos/" +
//       req.files.video[0].filename.replace(/ /g, "_"),
//     video_name: req.files.video[0].filename.replace(/ /g, "_"),
//     thumbnail_path:
//       "http://localhost:" +
//       5000 +
//       "/api/videos/" +
//       req.files.image[0].filename.replace(/ /g, "_"),
//     thumbnail_name: req.files.image[0].filename.replace(/ /g, "_"),

// @route POST api/videos
// @desc Upload Videos
// @access Only Admin
router.post("/", async (req, res) => {
  // Form validation
  //   const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  //   if (!isValid) {
  //     return res.status(400).json(errors);
  //   }

  const video = new Video({
    name: req.body.name,
    description: req.body.description,
  });

  await video
    .save()
    .then((data) => {
      res.status(201).json({ message: "Successfully Uploaded" });
    })
    .catch((err) => {
      res.status(400).json({ errors: err });
    });
});

// @route GET api/videos
// @desc Get All Videos
// @access Public
router.get("/", async (req, res) => {
  await Video.find({})
    .then((videos) => {
      res
        .status(200)
        .json({ statusCode: 200, message: "All Videos", videos: videos });
    })
    .catch((err) => {
      makeResponse(res, 500, "Failed !", err, true);
    });
});

// @route GET api/videos
// @desc Get All Videos
// @access Public
router.get("/:id", async (req, res) => {
  await Video.findOne({ _id: req.params.id })
    .then((video) => {
      res.status(200).json({
        statusCode: 200,
        message: "Single Video Successfull",
        data: video,
      });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ statusCode: 400, message: "Single Video Failed", errors: err });
    });
});

router.put("/:id", async (req, res) => {
  const updatedObj = {
    name: req.body.name,
    description: req.body.description,
  };

  const updated = await Video.findOneAndUpdate(
    { _id: req.params.id },
    updatedObj,
    {
      new: true,
    }
  )
    .then((video) => {
      res
        .status(200)
        .json({ statusCode: 200, message: "Updated Video", data: video });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ statusCode: 400, message: "Update Failed", errors: err });
    });
});

router.post("/review/:video_id", async (req, res) => {
  const vid_id = req.params.video_id;
  var updatingVideo = null;

  const newReview = {
    negative: req.body.negative,
    like: req.body.like,
    possitive: req.body.possitive,
  };

  console.log("Video Reviews => ", newReview);

  await Video.findById(vid_id)
    .then((updateVid) => {
      updatingVideo = updateVid;
    })
    .catch((err) => {
      res
        .status(400)
        .json({ statusCode: 400, message: "Update Failed", errors: err });
    });
  if (updatingVideo !== null) {
    await Video.findOneAndUpdate(
      { _id: vid_id },
      { reviews: [...updatingVideo.reviews, newReview] },
      {
        new: true,
      }
    )
      .then((updated) => {
        res.status(200).json({
          statusCode: 200,
          message: "Updated Successfully",
          data: updated,
        });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ statusCode: 400, message: "Update Failed", errors: err });
      });
  }
});

// @route DELETE api/videos
// @desc Delete single Video
// @access Public
router.delete("/:id", async (req, res) => {
  // await Video.findById(req.query.id)
  //   .then((vid) => {
  //     try {
  //       fs.unlinkSync(`media/uploads/${vid.video_name}`);
  //       fs.unlinkSync(`media/uploads/${vid.thumbnail_name}`);
  //       //file removed
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   })
  //   .catch((err) => makeResponse(res, 500, "Failed", err, true));

  await Video.deleteOne({ _id: req.params.id })
    .then((video) => {
      makeResponse(res, 200, "Deleted Video", video, false);
    })
    .catch((err) => {
      makeResponse(res, 500, "Failed", err, true);
    });
});

module.exports = router;
