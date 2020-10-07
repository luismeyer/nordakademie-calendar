"use strict";
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module './resources/modules.json'. Con... Remove this comment to see the full error message
import { modules } from "./resources/modules.json";

// @ts-expect-error ts-migrate(1192) FIXME: Module '"/Users/luis.meyer/Projects/nak-calendar/s... Remove this comment to see the full error message
import timetable from "./src/services/timetable";
// @ts-expect-error ts-migrate(1192) FIXME: Module '"/Users/luis.meyer/Projects/nak-calendar/s... Remove this comment to see the full error message
import mensa from "./src/services/mensa";
// @ts-expect-error ts-migrate(1192) FIXME: Module '"/Users/luis.meyer/Projects/nak-calendar/s... Remove this comment to see the full error message
import bot from "./src/services/bot";

// TimeTable Api Handler
export const timetableFormatter = async () => {
  await timetable.formatBatch(modules);
  return await timetable.formatSingle("NAK.ics");
};

// Mensa Api Handler
export const mensaFormatter = mensa.format;

// Telegram Bot Handler
// @ts-expect-error ts-migrate(7022) FIXME: 'bot' implicitly has type 'any' because it does no... Remove this comment to see the full error message
export const bot = bot.handle;
