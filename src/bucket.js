const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const FILENAME = "NAK.ics";
const { BUCKET } = process.env;
if (!BUCKET) throw new Error("Missing Environment Variable: BUCKET");

module.exports.uploadToS3 = (
  data,
  filename = FILENAME,
  bucket = BUCKET
) => {
  const uploadParams = {
    Bucket: bucket,
    Key: filename,
    Body: data,
    ACL: "public-read"
  };

  return s3.putObject(uploadParams).promise();
};