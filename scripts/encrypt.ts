import fs from "fs";
import { exec as defaultExec } from "child_process";
import meow from "meow";
import { promisify } from "util";

import {
  MEETINGS,
  SECRETS,
  SECRETS_ENCRYPTED,
  MEETINGS_ENCRYPTED,
} from "../src/utils/constants";

const exec = promisify(defaultExec);

const cli = meow(
  `
    Usage
      $ encrypt [options]
    Options
      --passphrase, -p  Passphrase to encrypt secret files
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

const enccryptFilePath = (filepath: string, outputPath: string) => {
  console.log(`Encrypting ${filepath}...`);
  if (!fs.existsSync(filepath)) return Promise.resolve();

  return exec(
    `gpg --quiet --batch --yes --symmetric --passphrase="${passphrase}" --output ${outputPath} ${filepath}`
  ).then((result) => console.log("Result: ", result));
};

enccryptFilePath(SECRETS, SECRETS_ENCRYPTED).then(() =>
  enccryptFilePath(MEETINGS, MEETINGS_ENCRYPTED)
);
