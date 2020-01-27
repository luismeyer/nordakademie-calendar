const ical = require("node-ical");
const fetch = require("node-fetch");
const {
  parseISO,
  isWithinInterval
} = require("date-fns");
const jsdom = require("jsdom");
const {
  JSDOM
} = jsdom;

const utils = require("./utils");

module.exports.calendarUrl = semester =>
  `https://cis.nordakademie.de/fileadmin/Infos/Stundenplaene/A18b_${semester}.ics`;

const SEMESTERS = require("../semesters.json");
module.exports.currentSemester = (semesters = SEMESTERS) =>
  semesters.find(({
      start,
      end
    }) =>
    isWithinInterval(new Date(), {
      start: parseISO(start),
      end: parseISO(end)
    })
  );

module.exports.fetchCalendar = async semester => {
  const url = this.calendarUrl(semester);

  if (await utils.isValidUrl(url)) {
    return ical.fromURL(url)
  }
}

const formatDescription = (description) =>
  utils.formatInnerHtml(description.replace(/ \(.*\)/, ""));

module.exports.fetchMensaTimetable = async () =>
  fetch("https://cis.nordakademie.de/mensa/speiseplan.cmd")
  .then(res => res.text());

module.exports.formatMensaTimetable = (mensaHtml) => {
  if (!mensaHtml) return [];

  const {
    document
  } = new JSDOM(mensaHtml).window;
  const days = document.querySelectorAll(".speiseplan-tag-container");
  const dates = [...document.querySelectorAll("td.speiseplan-head")];

  return [...days].map((column, index) => {
    const [mainDish, secondDish] = column.querySelectorAll(".gericht");

    const date = utils.formatInnerHtml(dates[index].textContent);
    const [day, month] = date.match(/\d{1,2}/g);

    return {
      date: `${new Date().getFullYear()}-${month}-${day}T23:00:00.000Z`,
      main: {
        description: formatDescription(
          mainDish.querySelector(".speiseplan-kurzbeschreibung").textContent
        ),
        price: utils.formatInnerHtml(
          mainDish.querySelector(".speiseplan-preis").textContent
        )
      },
      second: {
        description: formatDescription(
          secondDish.querySelector(".speiseplan-kurzbeschreibung").textContent
        ),
        price: utils.formatInnerHtml(
          secondDish.querySelector(".speiseplan-preis").textContent
        )
      }
    };
  });
}