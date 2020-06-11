const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const Video = require("../../models/Video");
const makeResponse = require("../../helpers/response");
const fs = require("fs");
const path = require("path");
const passport = require("passport");

// AWS-S3 Preparation
const s3 = new aws.S3({
  accessKeyId: "AKIA46Q7F4PO2BGQBH7P",
  secretAccessKey: "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",
  Bucket: "adriver-bucket",
});

const uploadsBusinessGallery = multer({
  storage: multerS3({
    s3: s3,
    bucket: "adriver-bucket",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 50000000 }, // In bytes: 2000000 bytes = 50 MB
}).array("video", 2);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    uploadsBusinessGallery(req, res, async (error) => {
      if (error) {
        console.log("errors", error);
        res.json({ error: error });
      } else {
        // If File not found
        // console.log("Ressss => ", req.files);
        if (req.files === undefined) {
          console.log("Error: No File Selected!");
          res.json("Error: No File Selected");
        } else {
          // If Success

          const newPOst = new Video({
            name: req.body.name,
            description: req.body.description,
            video_path: req.files[0].location,
            video_name: req.files[0].originalname,
            video_key: req.files[0].key,
            thumbnail_path: req.files[1].location,
            thumbnail_name: req.files[1].originalname,
            thumbnail_key: req.files[1].key,
            user: req.user.id,
          });

          await newPOst
            .save()
            .then((vid) => {
              res.status(200).json({
                statusCode: 200,
                message: "New Add Uploaded SUccessfully",
                data: vid,
              });
            })
            .catch((err) => {
              res.status(400).json({
                statusCode: 400,
                message: "Add Upload Failed",
                error: err,
              });
            });

          // Save the file name into databaseres.json( {
          //  filesArray: fileArray,
          //  locationArray: galleryImgLocationArray
          // } );
        }
      }
    });
  }
);

// @route GET api/videos
// @desc Get All Videos
// @access Public
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Video.find({})
      .populate("user")
      .then((videos) => {
        res
          .status(200)
          .json({ statusCode: 200, message: "All Videos", videos: videos });
      })
      .catch((err) => {
        makeResponse(res, 500, "Failed !", err, true);
      });
  }
);

// @route GET api/videos/:id
// @desc Get Single Videos By ID
// @access Public
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Video.findOne({ _id: req.params.id })
      .then((video) => {
        res.status(200).json({
          statusCode: 200,
          message: "Single Video Successfull",
          data: video,
        });
      })
      .catch((err) => {
        res.status(400).json({
          statusCode: 400,
          message: "Single Video Failed",
          errors: err,
        });
      });
  }
);

// @route PUT api/videos/:id
// @desc Update Single Videos By ID
// @access Public
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

// @route POST api/videos/review/:id
// @desc create review against a video
// @access Public
router.post(
  "/review/:video_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

// @route DELETE api/videos
// @desc Delete single Video
// @access Public
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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

    await Video.findOne({ _id: req.params.id })
      .then((video) => {
        s3.deleteObjects(
          {
            Bucket: "adriver-bucket",
            Delete: {
              // required
              Objects: [
                // required
                {
                  Key: video.video_key, // required
                },
                {
                  Key: video.thumbnail_key,
                },
              ],
            },
          },
          function (err, data) {
            if (err) {
              console.log(err, err.stack);
            } else {
              console.log("Data from s3 => ", data);
              Video.deleteOne({ _id: req.params.id })
                .then((vide) => {
                  return makeResponse(res, 200, "Deleted Video", video, false);
                })
                .catch((err) => {
                  return makeResponse(res, 500, "Failed", err, true);
                });
            }
            // an error occurred
            // else makeResponse(res, 200, "Deleted Video", video, false);
            // successful response
          }
        );
      })
      .catch((err) => {
        res.status(400).json({
          statusCode: 400,
          message: "No video found",
          errors: err,
        });
      });
  }
);

module.exports = router;

/* Uploading Single Image to S3 using multer and multer-s3 */

// const profileImgUpload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "adriver-bucket",
//     acl: "public-read",
//     key: function (req, file, cb) {
//       cb(
//         null,
//         path.basename(file.originalname, path.extname(file.originalname)) +
//           "-" +
//           Date.now() +
//           path.extname(file.originalname)
//       );
//     },
//   }),
//   limits: { fileSize: 50000000 }, // In bytes: 2000000 bytes = 50 MB
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// }).single("thumbnail");

// /**
//  * @route POST api/profile/business-img-upload
//  * @desc Upload post image
//  * @access public
//  */
// router.post("/thumbnail", (req, res) => {
//   profileImgUpload(req, res, (error) => {
//     // console.log( 'requestOkokok', req.file );
//     // console.log( 'error', error );
//     if (error) {
//       console.log("errors", error);
//       res.json({ error: error });
//     } else {
//       // If File not found
//       if (req.file === undefined) {
//         console.log("Error: No File Selected!");
//         res.json("Error: No File Selected");
//       } else {
//         // If Success
//         const imageName = req.file.key;
//         const imageLocation = req.file.location;
//         console.log("Image Location => , ", imageLocation);
//         // Save the file name into database into profile modelres.json( {
//         //  image: imageName,
//         //  location: imageLocation
//         // } );
//       }
//     }
//   });
// }); // End of single profile upload/**
