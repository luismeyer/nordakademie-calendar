const AWS = require("aws-sdk");

const FILENAME = "NAK.ics";
const {
  BUCKET,
  IS_LOCAL
} = process.env;
if (!BUCKET) throw new Error("Missing Environment Variable: BUCKET");

const s3Params = {
  s3ForcePathStyle: true,
  accessKeyId: "S3RVER",
  secretAccessKey: "S3RVER",
  endpoint: IS_LOCAL && new AWS.Endpoint("http://localhost:8000")
};
const s3 = new AWS.S3(IS_LOCAL && s3Params);

module.exports.uploadToS3 = (data, filename = FILENAME, bucket = BUCKET) => {
  const uploadParams = {
    Bucket: bucket,
    Key: filename,
    Body: data,
    ACL: "public-read"
  };

  return s3.putObject(uploadParams).promise();
};