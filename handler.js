"use strict";
const { modules } = require("./resources/modules.json");

const timetable = require("./src/services/timetable");
const mensa = require("./src/services/mensa");
const bot = require("./src/services/bot");

// TimeTable Api Handler
module.exports.timetableFormatter = async () => {
  await timetable.formatBatch(modules);
  return await timetable.formatSingle("NAK.ics");
};

// Mensa Api Handler
module.exports.mensaFormatter = mensa.format;

// Telegram Bot Handler
module.exports.bot = bot.handle;
