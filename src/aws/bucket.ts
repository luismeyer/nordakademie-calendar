import AWS from "aws-sdk";
import ical from "node-ical";

const { BUCKET, IS_LOCAL } = process.env;
if (!BUCKET) throw new Error("Missing Environment Variable: BUCKET");

const localS3Params = {
  s3ForcePathStyle: true,
  accessKeyId: "S3RVER",
  secretAccessKey: "S3RVER",
  endpoint: IS_LOCAL && new AWS.Endpoint("http://localhost:8000"),
};
// @ts-expect-error ts-migrate(2345) FIXME: Type '""' is not assignable to type 'ClientConfigu... Remove this comment to see the full error message
const s3 = new AWS.S3(IS_LOCAL && localS3Params);

export const uploadToS3 = (data: any, filename: any, bucket = BUCKET) =>
  s3
    .putObject({
      Bucket: bucket,
      Key: filename,
      Body: data,
      ACL: "public-read",
    })
    .promise();

export const fetchCalendarFile = async (filename: any, bucket = BUCKET) => {
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

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    return ical.async.parseICS(ics.Body.toString());
  }
};
