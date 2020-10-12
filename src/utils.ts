import fetch from "node-fetch";
import path from "path";

export const isValidUrl = (url: string) =>
  fetch(url).then((res) => Math.floor(res.status / 100) === 2);

export const formatInnerHtml = (text: string) =>
  text.replace(/\s+/g, " ").trim();

export const Logger = class Logger {
  max: number;
  progress: number;
  filename: string;

  constructor(max: number, filename: string) {
    this.max = max;
    this.progress = 1;
    this.filename = filename;
  }

  print(message: string) {
    console.info(
      `${this.progress}/${this.max}: ${this.filename} | ${message}\n`
    );
    this.progress += 1;
  }

  static print(message: string) {
    console.info(message, "\n");
  }
};

const { IS_LOCAL, IS_OFFLINE } = process.env;

export const isLocal = () => IS_LOCAL || IS_OFFLINE;

export const resourcesDir = () => path.resolve(__dirname, "../resources");
