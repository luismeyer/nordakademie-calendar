import { parseFile, parseICS } from "node-ical";
import path from "path";
import { addDays, format } from "date-fns";

import {
  findSummary,
  checkEventDifference,
  formatCalendar,
} from "../../src/calendar/format";

const mockCalendar = parseFile(
  path.resolve(__dirname, "../mockdata/mock-calendar.ics")
);

test("finds veranstaltung", () => {
  expect(findSummary("Veranstaltung: NAMENAME\nDozent:")).toBe("NAMENAME");
});

test("skips missing summarys", () => {
  Object.values(mockCalendar)[1].description = undefined;

  expect(formatCalendar(mockCalendar)).toBeDefined();
});

test("formats calendar object", () => {
  Object.values(mockCalendar)[1].description =
    "Studiengruppe: A17a\nVeranstaltung: V A107 Programmierparadigmen\nDozent: Prof. Dr.-Ing. Brauer\nRaum: EDV-A101\nUhrzeit-Dauer: 9:15 - 12:30 Uhr (4:00 UE)\nAnmerkung: -";

  const formattedCalendar = formatCalendar(mockCalendar);
  expect(formattedCalendar.events().length).toEqual(2);
  expect(formattedCalendar.events()[0].summary()).toBe("Programmierparadigmen");
});

test("checks event difference", () => {
  const newCal = formatCalendar(mockCalendar);
  const oldCal = parseICS(newCal.toString());

  expect(checkEventDifference(newCal, oldCal)).toStrictEqual([]);
  const [_, diffEvent] = Object.values(oldCal);

  diffEvent.end = {
    ...addDays(new Date(diffEvent.end as Date), 4),
    tz: "",
  };

  expect(checkEventDifference(newCal, oldCal)).toStrictEqual([
    format(new Date(diffEvent.start as Date), "dd.MM.yyyy"),
  ]);
});
