import { exec as defaultExec } from 'child_process';
import { Command } from 'commander';
import fs from 'fs';
import { promisify } from 'util';

import {
    MEETINGS_PATH, MEETINGS_PATH_ENCRYPTED, SECRETS, SECRETS_ENCRYPTED
} from '../utils/constants';

const exec = promisify(defaultExec);

const program = new Command();
program.option("-p, --passphrase", "Passphrase to encrypt secret files");
program.parse(process.argv);

const { passphrase } = program.opts();
if (!passphrase) throw new Error("Missing flag: PASSPHRASE");

const enccryptFilePath = async (filepath: string, outputPath: string) => {
  console.log(`Encrypting ${filepath}...`);
  if (!fs.existsSync(filepath)) return Promise.resolve();

  return exec(
    `gpg --quiet --batch --yes --symmetric --passphrase="${passphrase}" --output ${outputPath} ${filepath}`
  ).then((result) => console.log("Result: ", result));
};

enccryptFilePath(SECRETS, SECRETS_ENCRYPTED).then(() =>
  enccryptFilePath(MEETINGS_PATH, MEETINGS_PATH_ENCRYPTED)
);
