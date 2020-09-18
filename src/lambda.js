const aws = require("aws-sdk");

const { isLocal } = require("./utils");

const lambda = new aws.Lambda({
  region: "eu-central-1",
  endpoint: isLocal() ? "http://localhost:3002" : undefined,
});

module.exports.callTimetableApi = () =>
  lambda
    .invoke({
      FunctionName: "calendar-formatter-dev-timetableApi",
      InvocationType: "Event",
    })
    .promise();

module.exports.callMensaApi = () =>
  lambda
    .invoke({
      FunctionName: "calendar-formatter-dev-mensaApi",
      InvocationType: "Event",
    })
    .promise();
