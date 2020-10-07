const fetch = require("node-fetch");

module.exports.isValidUrl = (url) =>
  fetch(url).then((res) => Math.floor(res.status / 100) === 2);

module.exports.formatInnerHtml = (text) => text.replace(/\s+/g, " ").trim();

module.exports.Logger = class Logger {
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

module.exports.isLocal = () => IS_LOCAL || IS_OFFLINE;
