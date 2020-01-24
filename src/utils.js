const fetch = require("node-fetch");

module.exports.isValidUrl = url => fetch(url).then(res => Math.floor(res.status / 100) === 2)

module.exports.formatInnerHtml = text => text.replace(/\s+/g, " ").trim();