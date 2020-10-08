import { parseFile, parseICS } from "node-ical";
import path from "path";
import { addDays, format, startOfWeek } from "date-fns";

import * as calendar from "../src/calendar";

const mockCalendar = parseFile(
  path.resolve(__dirname, "mockdata/mock-calendar.ics")
);

test("finds veranstaltung", () => {
  expect(calendar.getSummary("Veranstaltung: NAMENAME\nDozent:")).toBe(
    "NAMENAME"
  );
});

test("removes module id", () => {
  expect(calendar.formatSummary("V A112 Algorithmen&Datenstrukturen")).toBe(
    "Algorithmen&Datenstrukturen"
  );
});

test("skips missing summarys", () => {
  Object.values(mockCalendar)[1].description = undefined;

  expect(calendar.formatCalendar(mockCalendar)).toBeDefined();
});

test("formats calendar object", () => {
  Object.values(mockCalendar)[1].description =
    "Studiengruppe: A17a\nVeranstaltung: V A107 Programmierparadigmen\nDozent: Prof. Dr.-Ing. Brauer\nRaum: EDV-A101\nUhrzeit-Dauer: 9:15 - 12:30 Uhr (4:00 UE)\nAnmerkung: -";

  const formattedCalendar = calendar.formatCalendar(mockCalendar);
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
      date: "2020-01-27",
    },
  ];

  const cal = calendar.createMensaEvents(mockMensa);
  expect(cal.events()[0]).toBeDefined();
  expect(cal.events()[0].summary()).toBe("Description 1");
});

test("formats meetings", () => {
  const formatted = calendar.formatMeeting({ url: "test", password: "test" });
  expect(formatted.includes("Url: test")).toBe(true);
  expect(formatted.includes("Password: test")).toBe(true);

  const formatted2 = calendar.formatMeeting({ url: "test" });
  expect(formatted2.includes("Url: test")).toBe(true);
  expect(formatted2.includes("Password: test")).toBe(false);
});

test("checks event difference", () => {
  const newCal = calendar.formatCalendar(mockCalendar);
  const oldCal = parseICS(newCal.toString());

  expect(calendar.checkEventDifference(newCal, oldCal)).toStrictEqual([]);
  const [_, diffEvent] = Object.values(oldCal);

  diffEvent.end = {
    ...addDays(new Date(diffEvent.end as Date), 4),
    tz: "",
  };

  expect(calendar.checkEventDifference(newCal, oldCal)).toStrictEqual([
    format(new Date(diffEvent.start as Date), "dd.MM.yyyy"),
  ]);
});

test("Handles meeting information", () => {
  let result = calendar.meetingInformation({ summary: "A123" });
  expect(result).toEqual({
    url: "SIMPLE_URL",
    password: "SIMPLE_PASSWORD",
  });

  result = calendar.meetingInformation({
    start: startOfWeek(new Date()),
    summary: "B123",
  });
  expect(result).toEqual({
    url: "RIGHT_URL",
    password: "RIGHT_PASS",
  });

  result = calendar.meetingInformation({
    description: "REGEX",
    summary: "C123",
  });
  expect(result).toEqual({
    regex: "REGEX",
    url: "RIGHT URL",
  });
});
