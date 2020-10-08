import path from "path";
import fs from "fs";
import { CalendarResponse } from "node-ical";

import { fetchCalendar } from "../nak";
import { formatCalendar, checkEventDifference } from "../calendar";
import { sendMessage } from "../telegram";
import { Logger } from "../utils";

import { fetchCalendarFile, uploadToS3 } from "../aws/bucket";
import { Batch } from "../typings/index";

const { CHAT_ID } = process.env;
if (!CHAT_ID) throw new Error("Missing environment variable: CHAT_ID");

const send = (msg: string) => sendMessage(CHAT_ID, msg);

const format = async (
  nakCal: CalendarResponse,
  filename: string,
  filter?: string
) => {
  const logger = new Logger(4);

  logger.print(`${filename}: Formatting timetable`);
  const formattedCalendar = formatCalendar(nakCal, filter);

  logger.print(`${filename}: Fetching old timetable and compares calendars`);
  const oldTimetable = await fetchCalendarFile(filename);
  const calendarDiff = await checkEventDifference(
    formattedCalendar,
    oldTimetable
  );

  if (calendarDiff.length) {
    await send(`${filename}: veränderung hier: ${calendarDiff.join(" , ")}`);
  }

  logger.print(`${filename}: Uploading file to S3`);
  await uploadToS3(formattedCalendar.toString(), filename);

  logger.print(`${filename}: Sending notification`);
  return send(`${filename}: stundenplan fertig! lol 🥳`);
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
