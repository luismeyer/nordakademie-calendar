"use strict";
const nak = require("./src/nak");
const calendar = require("./src/calendar");
const bucket = require("./src/bucket");
const bot = require("./src/bot");
const lambda = require("./src/lambda");

const {
  CHAT_ID,
} = process.env;

let progress;
const printProgess = max => message => {
  console.info(`${progress}/${max}: ${message}`);
  progress += 1;
};

module.exports.formatter = async (event, context, callback) => {
  progress = 1;
  const print = printProgess(8);

  print("Calculating current semester");
  const currentSemester = nak.currentSemester();
  if (!currentSemester) return;

  print("Fetching timetable");
  const nakCal = await nak.fetchCalendar(currentSemester.semester)
  if (!nakCal) return;

  print("Formatting timetable");
  const formattedCalendar = calendar.format(nakCal);

  print("Fetching old timetable and compares calendars");
  const oldTimetable = await bucket.fetchCalendarFile();
  const calendarDiff = await calendar.checkEventDifference(oldTimetable, formattedCalendar);

  if (calendarDiff.length) {
    bot.sendMessage(`kalendar veränderung hier: ${calendarDiff.join()}`);
  }

  print("Fetching mensa timetable");
  const mensaHtml = await nak.fetchMensaTimetable();
  const mensaTimetable = nak.formatMensaTimetable(mensaHtml)

  if (mensaTimetable) {
    print("Creating mensa events");
    calendar.createMensaEvents(formattedCalendar, mensaTimetable);
  } else {
    print("Skipping mensa event creation")
  }

  if (CHAT_ID) {
    print("Sending notification");
    await bot.sendMessage(CHAT_ID, "hab fertig! lol 🥳");
  } else {
    print("Skipping notification");
  }

  print("Uploading file to S3");
  await bucket
    .uploadToS3(formattedCalendar.toString())
    .then(res => callback(null, res), callback);
};

module.exports.bot = async event => {
  const body = JSON.parse(event.body);
  const {
    text,
    chat
  } = body.message;

  switch (text.toLowerCase()) {
    case "/sync":
      await bot.sendMessage(chat.id, "ich starte 💪");
      await lambda.callApi();
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