const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const FILENAME = "NAK.ics";
const BUCKET_NAME = process.env.BUCKET;

module.exports.uploadToS3 = (
  data,
  filename = FILENAME,
  bucket = BUCKET_NAME
) => {
  const uploadParams = {
    Bucket: bucket,
    Key: filename,
    Body: data,
    ACL: "public-read"
  };

  return s3.putObject(uploadParams).promise();
};