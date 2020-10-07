// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/node-fetch` if it exists o... Remove this comment to see the full error message
import nodeFetch from "node-fetch";

const { BOT_TOKEN, IS_LOCAL } = process.env;

export const requestUrl = (token: any) => (method: any) => `https://api.telegram.org/bot${token}/${method}`;

export const fetch = (url: any, params: any) =>
  nodeFetch(url, params).then((res: any) => res.json());

// @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
const telegramUrl = this.requestUrl(BOT_TOKEN);
const telegramFetch = (method: any, params: any) =>
  IS_LOCAL
    ? console.info(
        `Calling telegram "${method}" with params: ${JSON.stringify(params)}`
      )
    : // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
      this.fetch(telegramUrl(method), params);

export const sendMessage = (chat: any, message: any) => {
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
