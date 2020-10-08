import { S3, Endpoint } from "aws-sdk";
import ical from "node-ical";

import { isLocal } from "../utils";

const { BUCKET } = process.env;
if (!BUCKET) throw new Error("Missing Environment Variable: BUCKET");

const localS3Params = {
  s3ForcePathStyle: true,
  accessKeyId: "S3RVER",
  secretAccessKey: "S3RVER",
  endpoint: "http://localhost:8000",
};

const s3 = isLocal() ? new S3(localS3Params) : new S3();

export const uploadToS3 = (data: string, filename: string, bucket = BUCKET) =>
  s3
    .putObject({
      Bucket: bucket,
      Key: filename,
      Body: data,
      ACL: "public-read",
    })
    .promise();

export const fetchCalendarFile = async (filename: string, bucket = BUCKET) => {
  const headData = await s3
    .headObject({
      Bucket: bucket,
      Key: filename,
    })
    .promise()
    .catch((_) => {
      console.info("No old calendar found");
    });

  if (headData) {
    const ics = await s3
      .getObject({
        Bucket: bucket,
        Key: filename,
      })
      .promise();

    if (ics.Body) {
      return ical.async.parseICS(ics.Body.toString());
    }
  }
};
