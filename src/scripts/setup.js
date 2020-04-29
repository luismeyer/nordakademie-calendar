const bot = require("../bot");
const secrets = require("../../secrets/secrets.json");

(async () => {
  const url = bot.requestUrl(secrets.token)("setWebhook");
  const res = await bot.fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: secrets.webhookUrl,
    }),
  });

  console.info(res);
})();
