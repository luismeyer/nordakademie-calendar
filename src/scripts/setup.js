const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const bot = require("../bot");
const secrets = require("../../secrets/secrets.json");

const { PASSPHRASE } = process.env;
if (!PASSPHRASE) throw new Error("Missing env variable: Passphrase");

const fetchSetWebhook = () => {
  const url = bot.requestUrl(secrets.token)("setWebhook");
  return bot.fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: `https://${secrets.domain}/bot`,
    }),
  });
};

const decryptMeetings = () => {
  const filepath = path.resolve(__dirname, "../../resources/meetings.json");

  return exec(
    `gpg --quiet --batch --yes --decrypt --passphrase="${PASSPHRASE}" --output ${filepath} ${filepath}.gpg`
  );
};

(async () => {
  const res = await fetchSetWebhook();
  console.info(res);

  await decryptMeetings();
  console.info("decrypted Meetings");
})();
