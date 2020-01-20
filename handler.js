'use strict';
const nak = require('./src/nak');
const calendar = require('./src/calendar');
const bucket = require('./src/bucket');
const bot = require('./src/bot');

const { CHAT_ID } = process.env;

module.exports.formatter = async (event, context, callback) => {
  console.info("1/4: Calculating current semester");
  const currentSemester = nak.currentSemester();
  if (!currentSemester) return;

  console.info("2/4: Fetching nordakademie timetable");
  const nakCal = await nak.fetchCalendar(currentSemester.semester)
  if (!nakCal) return;

  console.info("3/4: Formatting timetable");
  const ics = calendar.format(nakCal);

  if (CHAT_ID) {
    console.info("Sending Notification");
    await bot.sendMessage(CHAT_ID, "Kalendar wird aktualisiert! lol 🥳");
  }

  console.info("4/4: Uploading file to S3");
  await bucket.uploadToS3(ics.toString())
    .then(res => callback(null, res), callback);
};

module.exports.bot = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  await bot.sendMessage(body.message.chat.id, body.message.text);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      message: "Alles Cool",
      json: event.body
    })
  }
}