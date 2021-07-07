import { modules } from "../resources/modules.json";

import {
  createBatchTimetable,
  createSingleTimetable,
} from "./services/timetable";
import { formatMensaCalendar } from "./services/mensa";
import { handleTelegramRequest } from "./services/bot";

// TimeTable Api Handler
export const timetableFormatter = async () => {
  await createBatchTimetable(modules);

  return await createSingleTimetable();
};

// Mensa Api Handler
export const mensaFormatter = formatMensaCalendar;

// Telegram Bot Handler
export const bot = handleTelegramRequest;
