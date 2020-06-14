const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/aws");
const path = require("path");

const uploadsBothVideoImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.Bucket,
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

const uploadsOnlyVideo = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.Bucket,
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
}).array("video", 1);

const uploadsOnlyImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.Bucket,
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
}).array("video", 1);

module.exports.uploadsBothVideoImage = uploadsBothVideoImage;
module.exports.uploadsOnlyVideo = uploadsOnlyVideo;
module.exports.uploadsOnlyImage = uploadsOnlyImage;
