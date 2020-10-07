// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/node-fetch` if it exists o... Remove this comment to see the full error message
import fetch from "node-fetch";

export const isValidUrl = (url: any) => fetch(url).then((res: any) => Math.floor(res.status / 100) === 2);

export const formatInnerHtml = (text: any) => text.replace(/\s+/g, " ").trim();

export const Logger = class Logger {
  max: any;
  progress: any;
  constructor(max: any) {
    this.max = max;
    this.progress = 1;
  }

  print(message: any) {
    console.info(`${this.progress}/${this.max}: ${message}\n`);
    this.progress += 1;
  }

  static print(message: any) {
    console.info(message, "\n");
  }
};

const { IS_LOCAL, IS_OFFLINE } = process.env;

export const isLocal = () => IS_LOCAL || IS_OFFLINE;
