import path from "path";
import util from "util";
const exec = util.promisify(require("child_process").exec);
import meow from "meow";

import telegram from "../telegram";

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
if (!passphrase) throw new Error("Missing flag: PASSPHRASE");

const start = () => {
  console.log("Setup app 🚀 \n");
  return Promise.resolve();
};

const decryptFilePath = (filepath) => () => {
  console.log(`Decrypting ${filepath}...`);
  const file = path.resolve(__dirname, filepath);

  return exec(
    `gpg --quiet --batch --yes --decrypt --passphrase="${passphrase}" --output ${file} ${file}.gpg`
  ).then((result) => console.log("Result: ", result));
};

const fetchSetWebhook = () => {
  console.log("Setting webhook...");

  import secrets from "../../secrets/secrets.json";
  if (!secrets.token) throw new Error("Missing secret: TOKEN");

  const url = telegram.requestUrl(secrets.token)("setWebhook");
  return telegram
    .fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: `https://${secrets.domain}/bot`,
      }),
    })
    .then((res) => console.log("Result: ", res));
};

start()
  .then(decryptFilePath("../../resources/meetings.json"))
  .then(decryptFilePath("../../secrets/secrets.json"))
  .then(fetchSetWebhook);
