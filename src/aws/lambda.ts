import aws from "aws-sdk";

import { isLocal } from "../utils";

const lambda = new aws.Lambda({
  region: "eu-central-1",
  endpoint: isLocal() ? "http://localhost:3002" : undefined,
});

export const callTimetableApi = () =>
  lambda
    .invoke({
      FunctionName: "calendar-formatter-dev-timetableApi",
      InvocationType: "Event",
    })
    .promise();

export const callMensaApi = () =>
  lambda
    .invoke({
      FunctionName: "calendar-formatter-dev-mensaApi",
      InvocationType: "Event",
    })
    .promise();
