import nodeFetch, { RequestInit } from "node-fetch";

const { BOT_TOKEN, IS_LOCAL } = process.env;

export const requestUrl = (token: string, method: string) =>
  `https://api.telegram.org/bot${token}/${method}`;

export const fetch = (url: string, params: RequestInit) =>
  nodeFetch(url, params).then((res) => res.json());

const telegramFetch = (method: string, params: RequestInit) => {
  if (IS_LOCAL) {
    const msg = `Calling telegram "${method}" with params: }`;
    console.info(msg, JSON.stringify(params));
    return;
  }

  if (!BOT_TOKEN) throw new Error("Missing environment variable: BOT_TOKEN");
  return fetch(requestUrl(BOT_TOKEN, method), params);
};

export const sendMessage = (chat: string, message: string) => {
  if (!chat || !BOT_TOKEN) return;

  return telegramFetch("sendMessage", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chat,
      text: message,
    }),
  });
};
