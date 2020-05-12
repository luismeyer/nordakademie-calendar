const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const meow = require("meow");

const bot = require("../bot");
const secrets = require("../../secrets/secrets.json");

const cli = meow(
  `
    Usage
      $ setup [options]
    Options
      --passphrase, -p  Passphrase to decode secret files
`,
  {
    flags: {
      passphrase: {
        type: "string",
        alias: "p",
      },
    },
  }
);

const { passphrase } = cli.flags;

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
    `gpg --quiet --batch --yes --decrypt --passphrase="${passphrase}" --output ${filepath} ${filepath}.gpg`
  );
};

(async () => {
  const res = await fetchSetWebhook();
  console.info(res);

  await decryptMeetings();
  console.info("Finished decrypting Meetings");
})();
