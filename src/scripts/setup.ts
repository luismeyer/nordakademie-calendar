import { exec as defaultExec } from 'child_process';
import { Command } from 'commander';
import fs from 'fs';
import { promisify } from 'util';

import { fetch, requestUrl } from '../telegram';
import { Secrets } from '../typings';
import {
    MEETINGS_PATH, MEETINGS_PATH_ENCRYPTED, SECRETS, SECRETS_ENCRYPTED
} from '../utils/constants';
import { readJSON } from '../utils/json';

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

const decryptFilePath = (filepath: string, outputPath: string) => () => {
  console.log(`Decrypting ${filepath}...`);
  if (!fs.existsSync(filepath)) return Promise.resolve();

  return exec(
    `gpg --quiet --batch --yes --decrypt --passphrase="${passphrase}" --output ${outputPath} ${filepath}`
  ).then((result) => console.log("Result: ", result));
};

const readSecrets = (): Secrets => {
  return readJSON(SECRETS);
};

const fetchSetWebhook = () => {
  console.log("Setting webhook...");

  const secrets = readSecrets();
  if (!secrets.token) throw new Error("Missing secret: TOKEN");

  const url = requestUrl(secrets.token, "setWebhook");
  return fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: `https://${secrets.domain}/bot`,
    }),
  }).then((res) => console.log("Result: ", res));
};

start()
  .then(decryptFilePath(MEETINGS_PATH_ENCRYPTED, MEETINGS_PATH))
  .then(decryptFilePath(SECRETS_ENCRYPTED, SECRETS))
  .then(fetchSetWebhook);
