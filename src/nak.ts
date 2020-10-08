import ical from "node-ical";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

import { MensaWeek } from "./typings";
import { isValidUrl, formatInnerHtml } from "./utils";

export const calendarUrl = (semester: number, centuria?: string) => {
  if (!centuria) {
    const { CENTURIA } = process.env;

    if (!CENTURIA) throw new Error("Missing Environment Variable: CENTURIA");
    centuria = CENTURIA;
  }

  return `https://cis.nordakademie.de/fileadmin/Infos/Stundenplaene/${centuria}_${semester}.ics`;
};

export const fetchCalendar = async (centuria?: string) => {
  for (let i = 1; i < 10; i++) {
    const url = calendarUrl(i, centuria);
    const isValid = await isValidUrl(url);

    if (isValid) {
      return ical
        .fromURL(url)
        .catch((err) => console.error(`From url Error (${url}): ${err}`));
    }
  }

  return;
};

const formatDescription = (description: string) =>
  formatInnerHtml(description.replace(/ \(.*\)/, ""));

export const fetchMensaTimetable = async () =>
  fetch("https://cis.nordakademie.de/mensa/speiseplan.cmd").then(
    (res) => res.text() as Promise<string>
  );

const formatMensaPrice = (priceString: string) =>
  priceString.replace("Eur", "€");

export const formatMensaTimetable = (mensaHtml: string) => {
  if (!mensaHtml) return [];

  const { document } = new JSDOM(mensaHtml).window;
  const days = document.querySelectorAll(".speiseplan-tag-container");
  const dates = Array.from(document.querySelectorAll("td.speiseplan-head"));

  return Array.from(days)
    .map((column, index) => {
      const [main, second] = Array.from(column.querySelectorAll(".gericht"));

      if (!main && !second) return;

      const unformattedDate = dates[index].textContent;
      if (!unformattedDate) return;
      const date = formatInnerHtml(unformattedDate);
      const [day, month] = date.match(/\d{1,2}/g);

      const mainDish = main && {
        description: formatDescription(
          main.querySelector(".speiseplan-kurzbeschreibung").textContent
        ),
        price: formatMensaPrice(
          formatInnerHtml(main.querySelector(".speiseplan-preis").textContent)
        ),
      };

      const secondDish = second && {
        description: formatDescription(
          second.querySelector(".speiseplan-kurzbeschreibung").textContent
        ),
        price: formatMensaPrice(
          formatInnerHtml(second.querySelector(".speiseplan-preis").textContent)
        ),
      };

      return {
        date: `${new Date().getFullYear()}-${month}-${day}T22:00:00.000Z`,
        main: mainDish,
        second: secondDish,
      };
    })
    .filter((value) => value !== undefined) as MensaWeek;
};
