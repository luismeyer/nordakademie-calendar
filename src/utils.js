import fetch from "node-fetch";

export const isValidUrl = (url) =>
  fetch(url).then((res) => Math.floor(res.status / 100) === 2);

export const formatInnerHtml = (text) => text.replace(/\s+/g, " ").trim();

export const Logger = class Logger {
  constructor(max) {
    this.max = max;
    this.progress = 1;
  }

  print(message) {
    console.info(`${this.progress}/${this.max}: ${message}\n`);
    this.progress += 1;
  }

  static print(message) {
    console.info(message, "\n");
  }
};

const { IS_LOCAL, IS_OFFLINE } = process.env;

export const isLocal = () => IS_LOCAL || IS_OFFLINE;
