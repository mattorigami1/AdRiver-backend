const aws = require("aws-sdk");

// AWS-S3 Preparation
const s3 = new aws.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  Bucket: process.env.Bucket,
});

module.exports = s3;
