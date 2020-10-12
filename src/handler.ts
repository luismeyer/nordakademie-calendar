import { modules } from "../resources/modules.json";

import {
  formatBatchCalendar,
  formatSingleCalendar,
} from "./services/timetable";
import { formatMensaCalendar } from "./services/mensa";
import { handleTelegramRequest } from "./services/bot";

// TimeTable Api Handler
export const timetableFormatter = async () => {
  // await formatBatchCalendar(modules);
  return await formatSingleCalendar("NAK.ics");
};

// Mensa Api Handler
export const mensaFormatter = formatMensaCalendar;

// Telegram Bot Handler
export const bot = handleTelegramRequest;
