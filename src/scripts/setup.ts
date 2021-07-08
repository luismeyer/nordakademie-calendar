import { exec as defaultExec } from "child_process";
import { Command } from "commander";
import fs from "fs";
import { promisify } from "util";

import { fetch, requestUrl } from "../telegram";
import { MEETINGS_PATH, MEETINGS_PATH_ENCRYPTED } from "../utils/constants";

const { BOT_TOKEN, DOMAIN } = process.env;

const exec = promisify(defaultExec);

const program = new Command();
program.option("-p, --passphrase", "Passphrase to encrypt secret files");
program.parse(process.argv);

const { passphrase } = program.opts();
if (!passphrase) throw new Error("Missing flag: PASSPHRASE");

const start = () => {
  console.log("Setup app 🚀 \n");
  return Promise.resolve();
};

const decryptFile = (filepath: string, outputPath: string) => () => {
  console.log(`Decrypting ${filepath}...`);
  if (!fs.existsSync(filepath)) return Promise.resolve();

  return exec(
    `gpg --quiet --batch --yes --decrypt --passphrase="${passphrase}" --output ${outputPath} ${filepath}`
  ).then((result) => console.log("Result: ", result));
};

const fetchSetWebhook = async () => {
  console.log("Setting webhook...");

  if (!BOT_TOKEN) {
    throw new Error("Missing secret: TOKEN");
  }

  const url = requestUrl(BOT_TOKEN, "setWebhook");
  return fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: `https://${DOMAIN}/bot`,
    }),
  }).then((res) => console.log("Result: ", res));
};

start()
  .then(decryptFile(MEETINGS_PATH_ENCRYPTED, MEETINGS_PATH))
  .then(fetchSetWebhook);
