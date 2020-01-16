const nodeFetch = require("node-fetch");

module.exports.requestUrl = token => method => `https://api.telegram.org/bot${token}/${method}`;

module.exports.fetch = (url, params) =>
  nodeFetch(url, params)
  .then(res => res.json())

const requestUrl = this.requestUrl(process.env.BOT_TOKEN);
const telegramFetch = (method, params) => this.fetch(requestUrl(method), params)

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