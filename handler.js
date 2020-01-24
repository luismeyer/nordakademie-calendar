"use strict";
const nak = require("./src/nak");
const calendar = require("./src/calendar");
const bucket = require("./src/bucket");
const bot = require("./src/bot");
const lambda = require("./src/lambda");

const {
  CHAT_ID,
  IS_LOCAL
} = process.env;

const printProgess = max => (current, message) =>
  console.info(`${current}/${max}: ${message}`);

module.exports.formatter = async () => {
  const print = printProgess(6);

  print(1, "Calculating current semester");
  const currentSemester = nak.currentSemester();
  if (!currentSemester) return;

  print(2, "Fetching nordakademie timetable");
  const nakCal = await nak.fetchCalendar(currentSemester.semester)
  if (!nakCal) return;

  print(3, "Formatting timetable");
  const formattedCalendar = calendar.format(nakCal);

  print(4, "Fetching mensa timetable");
  const mensaHtml = await nak.fetchMensaTimetable();
  const mensaTimetable = nak.formatMensaTimetable(mensaHtml)

  if (mensaTimetable) {
    print(5, "Creating mensa events");
    calendar.createMensaEvents(formattedCalendar, mensaTimeTable);
  } else {
    print(5, "Skipping mensa event creation")
  }

  if (CHAT_ID && !IS_LOCAL) {
    console.info("Sending Notification");
    await bot.sendMessage(CHAT_ID, "hab fertig! lol 🥳");
  }

  print(6, "Uploading file to S3");
  await bucket
    .uploadToS3(formattedCalendar.toString())
    .then(res => callback(null, res), callback);
};

module.exports.bot = async (event, context, callback) => {
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