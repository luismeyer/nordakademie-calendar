"use strict";
import { modules } from "./resources/modules.json";

import timetable from "./src/services/timetable";
import mensa from "./src/services/mensa";
import bot from "./src/services/bot";

// TimeTable Api Handler
export const timetableFormatter = async () => {
  await timetable.formatBatch(modules);
  return await timetable.formatSingle("NAK.ics");
};

// Mensa Api Handler
export const mensaFormatter = mensa.format;

// Telegram Bot Handler
export const bot = bot.handle;
