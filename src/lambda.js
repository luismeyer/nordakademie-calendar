const aws = require("aws-sdk");

const lambda = new aws.Lambda({
  region: "eu-central-1",
});

module.exports.callTimetableApi = () =>
  lambda.invoke({
    FunctionName: "calendar-formatter-dev-timetableApi",
    InvocationType: "Event",
  }).promise();

module.exports.callMensaApi = () =>
  lambda.invoke({
    FunctionName: "calendar-formatter-dev-mensaApi",
    InvocationType: "Event",
  }).promise();