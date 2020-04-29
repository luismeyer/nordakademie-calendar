const bot = require("../bot");
const secrets = require("../../secrets/secrets.json");

const fetchSetWebhook = () => {
  const url = bot.requestUrl(secrets.token)("setWebhook");
  return bot.fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: secrets.webhookUrl,
    }),
  });
};

(async () => {
  const res = await fetchSetWebhook();

  console.info(res);
})();
