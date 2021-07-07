import { Lambda } from 'aws-sdk';

import { IS_LOCAL } from '../utils/constants';

const lambda = new Lambda({
  region: "eu-central-1",
  endpoint: IS_LOCAL ? "http://localhost:3002" : undefined,
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
