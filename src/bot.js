const nodeFetch = require("node-fetch");

const {
  BOT_TOKEN,
  IS_LOCAL
} = process.env;

module.exports.requestUrl = token => method => `https://api.telegram.org/bot${token}/${method}`;

module.exports.fetch = (url, params) =>
  nodeFetch(url, params)
  .then(res => res.json())

const telegramUrl = this.requestUrl(BOT_TOKEN);
const telegramFetch = (method, params) =>
  IS_LOCAL ? (
    console.info(`Calling telegram "${method}" with params: ${JSON.stringify(params)}`)
  ) : this.fetch(telegramUrl(method), params)

module.exports.sendMessage = (chat, message) => {
  return telegramFetch("sendMessage", {
    method: "post",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chat,
      text: message
    })
  })
}