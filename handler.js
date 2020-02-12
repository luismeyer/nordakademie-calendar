"use strict";
const nak = require("./src/nak");
const calendar = require("./src/calendar");
const bucket = require("./src/bucket");
const bot = require("./src/bot");
const lambda = require("./src/lambda");
const {
  Logger
} = require("./src/utils");

const {
  CHAT_ID,
} = process.env;

module.exports.timetableFormatter = async (event, context, callback) => {
  const logger = new Logger(6);
  const filename = "NAK.ics";

  logger.print("Calculating current semester");
  const currentSemester = nak.currentSemester();
  if (!currentSemester) return;

  logger.print("Fetching timetable");
  const nakCal = await nak.fetchCalendar(currentSemester.semester)
  if (!nakCal) return;

  logger.print("Formatting timetable");
  const formattedCalendar = calendar.format(nakCal);

  logger.print("Fetching old timetable and compares calendars");
  const oldTimetable = await bucket.fetchCalendarFile(filename);
  const calendarDiff = await calendar.checkEventDifference(oldTimetable, formattedCalendar);

  if (calendarDiff.length) {
    bot.sendMessage(`kalendar veränderung hier: ${calendarDiff.join()}`);
  }

  logger.print("Uploading file to S3");
  await bucket
    .uploadToS3(formattedCalendar.toString(), filename)
    .then(res => callback(null, res), callback);

  logger.print("Sending notification");
  await bot.sendMessage(CHAT_ID, "stundenplan fertig! lol 🥳");
};

module.exports.mensaFormatter = async (event, context, callback) => {
  const logger = new Logger(3);

  logger.print("Fetching mensa timetable");
  const mensaHtml = await nak.fetchMensaTimetable();
  const mensaTimetable = nak.formatMensaTimetable(mensaHtml)
  if (!mensaTimetable) return;

  logger.print("Creating mensa events");
  const mensaCalendar = calendar.createMensaEvents(calendar.generate(), mensaTimetable);

  logger.print("Uploading file to S3");
  await bucket
    .uploadToS3(mensaCalendar.toString(), "Mensa.ics")
    .then(res => callback(null, res), callback);

  logger.print("Sending notification");
  await bot.sendMessage(CHAT_ID, "mensa fertig! lol 🥳");
}

module.exports.bot = async event => {
  const body = JSON.parse(event.body);
  const {
    text,
    chat
  } = body.message;

  switch (text.toLowerCase()) {
    case "/synctimetable":
      await bot.sendMessage(chat.id, "starte kalendar-api 📆");
      await lambda.callTimetableApi();
      break;
    case "/syncmensa":
      await bot.sendMessage(chat.id, "starte mensa-api 🍔");
      await lambda.callMensaApi();
      break;
    case "/help":
      await bot.sendMessage(chat.id, "Nö 😋");
      break;
    case "/start":
      await bot.sendMessage(chat.id, "heyyyyyy 🤗👋");
      break;
    default:
      await bot.sendMessage(chat.id, "Will nicht mit dir reden 🤐 ");
      break;
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      message: "Alles Cool",
      json: event.body
    })
  };
};