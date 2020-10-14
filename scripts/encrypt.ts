import fs from "fs";
import path from "path";
import { exec as defaultExec } from "child_process";
import meow from "meow";
import { promisify } from "util";

const exec = promisify(defaultExec);

const SECRETS_INPUT = path.resolve(__dirname, "../secrets/secrets.json");
const SECRETS_OUTPUT = path.resolve(__dirname, "../secrets/secrets.json.gpg");

const MEETINGS_INPUT = path.resolve(__dirname, "../resources/meetings.json");
const MEETINGS_OUTPUT = path.resolve(__dirname, "../secrets/meetings.json.gpg");

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

enccryptFilePath(SECRETS_INPUT, SECRETS_OUTPUT).then(() =>
  enccryptFilePath(MEETINGS_INPUT, MEETINGS_OUTPUT)
);
