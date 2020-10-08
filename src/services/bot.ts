import { sendMessage } from "../telegram";
import { isLocal } from "../utils";

import { callTimetableApi, callMensaApi } from "../aws/lambda";

export const handleTelegramRequest = async (event: any) => {
  const body = isLocal() ? event.body : JSON.parse(event.body);
  const { text, chat } = body.message;
  console.log("Received Message: ", text);

  switch (text.toLowerCase()) {
    case "/synctimetable":
      await sendMessage(chat.id, "starte kalendar-api 📆");
      await callTimetableApi();
      break;
    case "/syncmensa":
      await sendMessage(chat.id, "starte mensa-api 🍔");
      await callMensaApi();
      break;
    case "/help":
      await sendMessage(chat.id, "Nö 😋");
      break;
    case "/start":
      await sendMessage(chat.id, "heyyyyyy 🤗👋");
      break;
    default:
      await sendMessage(chat.id, "Will nicht mit dir reden 🤐 ");
      break;
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      message: "Alles Cool",
      json: event.body,
    }),
  };
};
