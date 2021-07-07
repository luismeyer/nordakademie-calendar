import { S3 } from 'aws-sdk';
import ical from 'node-ical';

import { IS_LOCAL } from '../utils/constants';

const { BUCKET } = process.env;
if (!BUCKET) throw new Error("Missing Environment Variable: BUCKET");

const { REGION } = process.env;
if (!REGION) throw new Error("Missing Environment Variable: REGION");

const localS3Params = {
  s3ForcePathStyle: true,
  accessKeyId: "S3RVER",
  secretAccessKey: "S3RVER",
  endpoint: "http://localhost:8000",
};

const s3 = IS_LOCAL ? new S3(localS3Params) : new S3();

export const uploadToS3 = (
  data: string,
  filename: string,
  contentType?: string,
  bucket = BUCKET
) =>
  s3
    .putObject({
      Bucket: bucket,
      Key: filename,
      Body: data,
      ACL: "public-read",
      ContentType: contentType,
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

export const calendarFileNames = async (bucket = BUCKET) => {
  const objects = await s3.listObjectsV2({ Bucket: bucket }).promise();
  if (objects.$response.error || !objects.Contents) {
    return [];
  }

  return objects.Contents.map(({ Key }) => Key).filter(
    (name) => name && name.includes(".ics")
  );
};

export const toBucketUrl = (item?: string) =>
  IS_LOCAL
    ? `/${BUCKET}/${item}`
    : `https://${BUCKET}.s3.${REGION}.amazonaws.com/${item}`;
