import { parseISO, subDays } from "date-fns";
import generator from "ical-generator";
import { JSDOM } from "jsdom";

import { MensaWeek } from "../typings";
import { formatInnerHtml } from "../utils";

export const createMensaEvents = (mensaTimetable: MensaWeek) => {
  const calendar = generator();

  mensaTimetable.forEach(({ main, second, date }) => {
    const day = parseISO(date);

    const mainDescription = main ? `🥩  ${main.description} ${main.price}` : "";
    const secondDescription = second
      ? `🥦  ${second.description} ${second.price}`
      : "";

    calendar.createEvent({
      summary: main ? main.description : second.description,
      start: subDays(day, 1),
      end: day,
      description:
        mainDescription +
        (mainDescription && secondDescription ? "\n\n" : "") +
        secondDescription,
      location: "Mensa",
    });
  });

  return calendar;
};

const formatDescription = (description: string) =>
  formatInnerHtml(description.replace(/ \(.*\)/, ""));

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
