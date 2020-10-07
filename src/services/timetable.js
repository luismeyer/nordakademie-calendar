const nak = require("../nak");
const calendar = require("../calendar");
const telegram = require("../telegram");
const { Logger } = require("../utils");

const bucket = require("../aws/bucket");

const { CHAT_ID } = process.env;

const sendMessage = (msg) => telegram.sendMessage(CHAT_ID, msg);

const format = async (nakCal, filename, filter) => {
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

module.exports.formatBatch = async (batch) => {
  Logger.print(`BATCH: Fetching timetable`);
  const nakCal = await nak.fetchCalendar();

  return Promise.all(
    batch.map(({ filename, filter }) => format(nakCal, filename, filter))
  );
};

module.exports.formatSingle = async (filename) => {
  Logger.print(`${filename}: Fetching timetable`);
  const nakCal = await nak.fetchCalendar();

  if (!nakCal) {
    await sendMessage(`${filename}: kein aktuellen kalendar gefunden`);
    return;
  }

  return format(nakCal, filename);
};
