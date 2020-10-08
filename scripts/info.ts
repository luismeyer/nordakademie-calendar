import { fetch, requestUrl } from "../src/telegram";
import secrets from "../secrets/secrets.json";

(async () => {
  const url = requestUrl(secrets.token, "getWebhookInfo");

  const res = await fetch(url, {
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
