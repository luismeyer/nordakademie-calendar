import { CalendarResponse } from "node-ical";

import { fetchCalendar } from "../nak";
import { renderPage } from "../render";
import { sendMessage } from "../telegram";

import { Logger } from "../utils/logger";
import { Batch } from "../typings/index";
import { fetchCalendarFile, uploadToS3 } from "../aws/bucket";
import { formatCalendar, checkEventDifference } from "../calendar/format";

const { CHAT_ID } = process.env;
if (!CHAT_ID) throw new Error("Missing environment variable: CHAT_ID");

const send = (msg: string) => sendMessage(CHAT_ID, msg);

const format = async (
  nakCal: CalendarResponse,
  filename: string,
  filter?: string
) => {
  const logger = new Logger(5, filename);

  logger.print(`Formatting timetable`);
  const formattedCalendar = formatCalendar(nakCal, filter);

  logger.print(`Fetching old timetable and compares calendars`);
  const oldTimetable = await fetchCalendarFile(filename);
  const calendarDiff = checkEventDifference(formattedCalendar, oldTimetable);

  if (calendarDiff.length) {
    await send(`veränderung hier: ${calendarDiff.join(" , ")}`);
  }

  logger.print(`Uploading file to S3`);
  await uploadToS3(formattedCalendar.toString(), filename);

  logger.print(`Sending notification`);
  await send(`${filename}: stundenplan fertig! lol 🥳`);

  logger.print(`Rendering Page`);
  return renderPage();
};

export const formatBatchCalendar = async (batch: Batch) => {
  Logger.print(`BATCH: Fetching timetable`);
  const nakCal = await fetchCalendar();

  if (!nakCal) {
    return await send(`BATCH: kein aktuellen kalendar gefunden`);
  }

  return Promise.all(
    batch.map(({ filename, filter }) => format(nakCal, filename, filter))
  );
};

export const formatSingleCalendar = async (filename: string) => {
  Logger.print(`${filename}: Fetching timetable`);
  const nakCal = await fetchCalendar();

  if (!nakCal) {
    return await send(`${filename}: kein aktuellen kalendar gefunden`);
  }

  return format(nakCal, filename);
};
