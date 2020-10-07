import bot from "../bot";
import secrets from "../../secrets/secrets.json";

(async () => {
  const url = bot.requestUrl(secrets.token)("getWebhookInfo");
  const res = await bot.fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: `https://${secrets.domain}/bot`,
    }),
  });
  console.info(res);
})();
