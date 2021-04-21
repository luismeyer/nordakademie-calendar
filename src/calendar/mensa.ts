import { endOfDay, parse } from "date-fns";
import { da, de } from "date-fns/locale";
import generator from "ical-generator";
import { JSDOM } from "jsdom";

import { MensaDay, MensaWeek } from "../typings";
import { formatInnerHtml } from "../utils/html";

const DAY_CONTAINER_CLASS = ".speiseplan-tag-container";
const DESCRIPTION_CLASS = ".speiseplan-kurzbeschreibung";
const PRICE_CLASS = ".speiseplan-preis";
const TABLE_HEAD_CLASS = "td.speiseplan-head";
const MEAL_CLASS = ".gericht";

export const createMensaEvents = (mensaTimetable: MensaWeek) => {
  const calendar = generator();

  mensaTimetable.forEach(({ main, second, date }) => {
    const start = endOfDay(date);

    const mainDescription = main ? `🥩  ${main.description} ${main.price}` : "";
    const secondDescription = second
      ? `🥦  ${second.description} ${second.price}`
      : "";

    calendar.createEvent({
      summary: main ? main.description : second.description,
      start,
      allDay: true,
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

export const formatMensaTimetable = (mensaHtml: string): MensaWeek => {
  if (!mensaHtml) return [];

  const { document } = new JSDOM(mensaHtml).window;
  const days = document.querySelectorAll(DAY_CONTAINER_CLASS);
  const dates = Array.from(document.querySelectorAll(TABLE_HEAD_CLASS));

  return Array.from(days)
    .map((column, index): MensaDay | undefined => {
      const [main, second] = Array.from(
        column.querySelectorAll<HTMLTableRowElement>(MEAL_CLASS)
      );

      if (!main && !second) return;

      const unformattedDate = dates[index].textContent;
      if (!unformattedDate) return;
      const date = formatInnerHtml(unformattedDate);

      const parsedDate = parse(date, "EEEE, d.M.", new Date(), {
        locale: de,
      });

      const mainDish = {
        description: formatDescription(
          main?.querySelector(DESCRIPTION_CLASS)?.textContent ?? ""
        ),
        price: formatMensaPrice(
          formatInnerHtml(main?.querySelector(PRICE_CLASS)?.textContent ?? "")
        ),
      };

      const secondDish = {
        description: formatDescription(
          second?.querySelector(DESCRIPTION_CLASS)?.textContent ?? ""
        ),
        price: formatMensaPrice(
          formatInnerHtml(second?.querySelector(PRICE_CLASS)?.textContent ?? "")
        ),
      };

      return {
        date: parsedDate,
        main: mainDish,
        second: secondDish,
      };
    })
    .filter((value): value is MensaDay => value !== undefined);
};
