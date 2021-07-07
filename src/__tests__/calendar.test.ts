import { addDays, format, startOfWeek } from 'date-fns';
import { parseFile, parseICS } from 'node-ical';
import path from 'path';

import { checkEventDifference, findSummary, formatCalendar } from '../calendar/format';
import { findMeeting } from '../calendar/meeting';
import { createMensaEvents, formatMensaTimetable } from '../calendar/mensa';
import { fetchMensaTimetable } from '../nak';

const mockCalendar = parseFile(
  path.resolve(__dirname, "mockdata/mock-calendar.ics")
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

test("creates calendar events", () => {
  const mockMensa = [
    {
      main: {
        description: "Description 1",
        price: "400",
      },
      second: {
        description: "Description 2",
        price: "100",
      },
      date: new Date(),
    },
  ];

  const cal = createMensaEvents(mockMensa);
  expect(cal.events()[0]).toBeDefined();
  expect(cal.events()[0].summary()).toBe("Description 1");
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

test("Handles meeting information", () => {
  let result = findMeeting({ summary: "A123" });
  expect(result).toContain("Url: SIMPLE_URL");
  expect(result).toContain("Password: SIMPLE_PASSWORD");

  result = findMeeting({
    start: startOfWeek(new Date()),
    summary: "B123",
  });
  expect(result).toContain("Url: RIGHT_URL");
  expect(result).toContain("Password: RIGHT_PASS");

  result = findMeeting({ description: "REGEX", summary: "C123" });
  expect(result).toContain("Url: RIGHT_URL");
});

test("formatMensaTimetable: catches missing mensa html", () => {
  const formattedTimetable = formatMensaTimetable("");
  expect(typeof formattedTimetable).toBe("object");
  expect(formattedTimetable.length).toBe(0);
});

test("formatMensaTimetable: formats mensa html string", async () => {
  const html = await fetchMensaTimetable();
  const mensa = formatMensaTimetable(html);
  if (!mensa.length) {
    return;
  }

  expect(Array.isArray(mensa)).toBe(true);
  expect(typeof mensa[0].main.description).toBeDefined();
  expect(mensa[0].date).toBeDefined();
  return;
});
