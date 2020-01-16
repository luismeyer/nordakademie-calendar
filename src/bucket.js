const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const FILENAME = "NAK.ics"

module.exports.uploadToS3 = (data) => {
  const uploadParams = {
    Bucket: process.env.BUCKET,
    Key: FILENAME,
    Body: data,
    ACL: 'public-read'
  };

  console.info('Starting S3 upload')
  return s3.putObject(uploadParams).promise()
}