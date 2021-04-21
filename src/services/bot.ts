import { sendMessage } from "../telegram";

import { callTimetableApi, callMensaApi } from "../aws/lambda";

const response = (message: string, json: string) => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
  body: JSON.stringify({
    message,
    json,
  }),
});

export const handleTelegramRequest = async (event: any) => {
  console.log("Received Body: ", event.body);

  if (!event?.body) {
    console.error("Missing Body");
    return response("Missing body", event?.body);
  }

  const body = JSON.parse(event.body);

  if (!body.message || !body.message.text || !body.message.chat) {
    console.error("Missing correct telegram message");
    return response("Missing correct telegram message", body);
  }

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
