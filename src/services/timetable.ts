// @ts-expect-error ts-migrate(1192) FIXME: Module '"/Users/luis.meyer/Projects/nak-calendar/s... Remove this comment to see the full error message
import nak from "../nak";
// @ts-expect-error ts-migrate(1192) FIXME: Module '"/Users/luis.meyer/Projects/nak-calendar/s... Remove this comment to see the full error message
import calendar from "../calendar";
// @ts-expect-error ts-migrate(1192) FIXME: Module '"/Users/luis.meyer/Projects/nak-calendar/s... Remove this comment to see the full error message
import telegram from "../telegram";
import { Logger } from "../utils";

// @ts-expect-error ts-migrate(1192) FIXME: Module '"/Users/luis.meyer/Projects/nak-calendar/s... Remove this comment to see the full error message
import bucket from "../aws/bucket";

const { CHAT_ID } = process.env;

const sendMessage = (msg: any) => telegram.sendMessage(CHAT_ID, msg);

const format = async (nakCal: any, filename: any, filter: any) => {
  const logger = new Logger(4);

  logger.print(`${filename}: Formatting timetable`);
  const formattedCalendar = calendar.format(nakCal, filter);

  logger.print(`${filename}: Fetching old timetable and compares calendars`);
  const oldTimetable = await bucket.fetchCalendarFile(filename);
  const calendarDiff = await calendar.checkEventDifference(
    oldTimetable,
    formattedCalendar
  );

  if (calendarDiff.length) {
    await sendMessage(
      `${filename}: veränderung hier: ${calendarDiff.join(" , ")}`
    );
  }

  logger.print(`${filename}: Uploading file to S3`);
  await bucket.uploadToS3(formattedCalendar.toString(), filename);

  logger.print(`${filename}: Sending notification`);
  return await sendMessage(`${filename}: stundenplan fertig! lol 🥳`);
};

export const formatBatch = async (batch: any) => {
  Logger.print(`BATCH: Fetching timetable`);
  const nakCal = await nak.fetchCalendar();

  return Promise.all(
    batch.map(({
      filename,
      filter
    }: any) => format(nakCal, filename, filter))
  );
};

export const formatSingle = async (filename: any) => {
  Logger.print(`${filename}: Fetching timetable`);
  const nakCal = await nak.fetchCalendar();

  if (!nakCal) {
    await sendMessage(`${filename}: kein aktuellen kalendar gefunden`);
    return;
  }

  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
  return format(nakCal, filename);
};
