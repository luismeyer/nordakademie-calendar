const aws = require("aws-sdk");

const lambda = new aws.Lambda({
  region: "eu-central-1",
});

module.exports.callApi = (chatId, code) =>
  lambda.invoke({
    FunctionName: "calendar-formatter-dev-api",
    InvocationType: "Event",
  }).promise();