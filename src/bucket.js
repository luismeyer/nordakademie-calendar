const AWS = require("aws-sdk");
const ical = require("node-ical");

const {
  BUCKET,
  IS_LOCAL
} = process.env;
if (!BUCKET) throw new Error("Missing Environment Variable: BUCKET");

const localS3Params = {
  s3ForcePathStyle: true,
  accessKeyId: "S3RVER",
  secretAccessKey: "S3RVER",
  endpoint: IS_LOCAL && new AWS.Endpoint("http://localhost:8000")
};
const s3 = new AWS.S3(IS_LOCAL && localS3Params);

module.exports.uploadToS3 = (data, filename, bucket = BUCKET) =>
  s3
  .putObject({
    Bucket: bucket,
    Key: filename,
    Body: data,
    ACL: "public-read"
  })
  .promise();

module.exports.fetchCalendarFile = async (
  filename,
  bucket = BUCKET
) => {
  const headData = await s3
    .headObject({
      Bucket: bucket,
      Key: filename
    })
    .promise()
    .catch(_ => {
      console.info("No old calendar found");
    });

  if (headData) {
    const ics = await s3
      .getObject({
        Bucket: bucket,
        Key: filename
      })
      .promise();

    return ical.async.parseICS(ics.Body.toString());
  }
};