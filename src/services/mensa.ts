import { fetchMensaTimetable, formatMensaTimetable } from "../nak";
import { createMensaEvents } from "../calendar";
import { sendMessage } from "../telegram";
import { Logger } from "../utils";

import { uploadToS3 } from "../aws/bucket";
import { renderPage } from "../frontend/render";

const { CHAT_ID } = process.env;
if (!CHAT_ID) throw new Error("Missing environment variable: CHAT_ID");

export const formatMensaCalendar = async () => {
  const logger = new Logger(5, "MENSA.ICS");

  logger.print("Fetching mensa timetable");
  const mensaHtml = await fetchMensaTimetable();
  if (!mensaHtml) {
    await sendMessage(CHAT_ID, "mensa seite nicht verfügbar");
    return;
  }

  const mensaTimetable = formatMensaTimetable(mensaHtml);
  if (!mensaTimetable || !mensaTimetable.length) {
    logger.print("No mensa timetable found. Exit function...");
    await sendMessage(CHAT_ID, "kein Mensaplan gefunden");
    return;
  }

  logger.print("Creating mensa events");
  const mensaCalendar = createMensaEvents(mensaTimetable);

  logger.print("Uploading file to S3");
  await uploadToS3(mensaCalendar.toString(), "Mensa.ics");

  logger.print("Sending notification");
  await sendMessage(CHAT_ID, "mensa fertig! lol 🥳");

  logger.print(`Rendering Page`);
  return renderPage();
};
