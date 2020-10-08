import fetch from "node-fetch";

export const isValidUrl = (url: string) =>
  fetch(url).then((res) => Math.floor(res.status / 100) === 2);

export const formatInnerHtml = (text: string) =>
  text.replace(/\s+/g, " ").trim();

export const Logger = class Logger {
  max: number;
  progress: number;

  constructor(max: number) {
    this.max = max;
    this.progress = 1;
  }

  print(message: string) {
    console.info(`${this.progress}/${this.max}: ${message}\n`);
    this.progress += 1;
  }

  static print(message: string) {
    console.info(message, "\n");
  }
};

const { IS_LOCAL, IS_OFFLINE } = process.env;

export const isLocal = () => IS_LOCAL || IS_OFFLINE;
