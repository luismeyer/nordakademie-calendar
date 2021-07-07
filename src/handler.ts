import { handleTelegramRequest } from './services/bot';
import { formatMensaCalendar } from './services/mensa';
import { createBatchTimetable, createSingleTimetable } from './services/timetable';
import { MODULES_PATH } from './utils/constants';
import { readJSON } from './utils/json';

const { modules } = readJSON(MODULES_PATH);

// TimeTable Api Handler
export const timetableFormatter = async () => {
  await createBatchTimetable(modules);

  return await createSingleTimetable();
};

// Mensa Api Handler
export const mensaFormatter = formatMensaCalendar;

// Telegram Bot Handler
export const bot = handleTelegramRequest;
