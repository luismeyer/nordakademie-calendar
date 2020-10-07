const { StringDecoder } = require("string_decoder");
const ical = require("node-ical");
const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

const utils = require("./utils");

module.exports.calendarUrl = (semester, centuria) => {
  if (!centuria) {
    const { CENTURIA } = process.env;

    if (!CENTURIA) throw new Error("Missing Environment Variable: CENTURIA");
    centuria = CENTURIA;
  }

  return `https://cis.nordakademie.de/fileadmin/Infos/Stundenplaene/${centuria}_${semester}.ics`;
};

module.exports.fetchCalendar = async (centuria) => {
  for (let i = 1; i < 10; i++) {
    const url = this.calendarUrl(i, centuria);
    const isValid = await utils.isValidUrl(url);

    if (isValid) {
      return ical
        .fromURL(url)
        .catch((err) => `From url Error (${url}): ${err}`);
    }
  }

  return false;
};

const formatDescription = (description) =>
  utils.formatInnerHtml(description.replace(/ \(.*\)/, ""));

module.exports.fetchMensaTimetable = async () =>
  fetch("https://cis.nordakademie.de/mensa/speiseplan.cmd").then((res) =>
    res.text()
  );

const formatMensaPrice = (priceString) => priceString.replace("Eur", "€");

module.exports.formatMensaTimetable = (mensaHtml) => {
  if (!mensaHtml) return [];

  const { document } = new JSDOM(mensaHtml).window;
  const days = document.querySelectorAll(".speiseplan-tag-container");
  const dates = [...document.querySelectorAll("td.speiseplan-head")];

  return [...days]
    .map((column, index) => {
      const [mainDish, secondDish] = column.querySelectorAll(".gericht");

      if (!mainDish && !secondDish) return;

      const date = utils.formatInnerHtml(dates[index].textContent);
      const [day, month] = date.match(/\d{1,2}/g);

      const main = mainDish && {
        description: formatDescription(
          mainDish.querySelector(".speiseplan-kurzbeschreibung").textContent
        ),
        price: formatMensaPrice(
          utils.formatInnerHtml(
            mainDish.querySelector(".speiseplan-preis").textContent
          )
        ),
      };

      const second = secondDish && {
        description: formatDescription(
          secondDish.querySelector(".speiseplan-kurzbeschreibung").textContent
        ),
        price: formatMensaPrice(
          utils.formatInnerHtml(
            secondDish.querySelector(".speiseplan-preis").textContent
          )
        ),
      };

      return {
        date: `${new Date().getFullYear()}-${month}-${day}T22:00:00.000Z`,
        main,
        second,
      };
    })
    .filter((value) => value !== undefined);
};
