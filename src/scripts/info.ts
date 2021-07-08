import { fetch, requestUrl } from "../telegram";

(async () => {
  const { BOT_TOKEN, DOMAIN } = process.env;

  if (!BOT_TOKEN) {
    throw new Error("Missing 'BOT_TOKEN'");
  }

  const url = requestUrl(BOT_TOKEN, "getWebhookInfo");

  const res = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: `https://${DOMAIN}/bot`,
    }),
  });

  console.info(res);
})();
