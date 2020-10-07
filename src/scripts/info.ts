// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../bot' or its corresponding t... Remove this comment to see the full error message
import bot from "../bot";
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../../secrets/secrets.json'. C... Remove this comment to see the full error message
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
