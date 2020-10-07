// @ts-expect-error ts-migrate(1192) FIXME: Module '"/Users/luis.meyer/Projects/nak-calendar/s... Remove this comment to see the full error message
import calendar from "../src/calendar";
import generator from "ical-generator";
import { subDays, format, addDays, startOfWeek } from "date-fns";

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("finds veranstaltung", () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(calendar.getSummary("Veranstaltung: NAMENAME\nDozent:")).toBe(
    "NAMENAME"
  );
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("removes module id", () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(calendar.formatSummary("V A112 Algorithmen&Datenstrukturen")).toBe(
    "Algorithmen&Datenstrukturen"
  );
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("skips missing summarys", () => {
  const mockEvent = {
    event: {
      summary: undefined,
    },
  };

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(calendar.format(mockEvent)).toBeDefined();
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("formats calendar object", () => {
  const mockEvent = {
    event: {
      description:
        "Studiengruppe: A17a\nVeranstaltung: V A107 Programmierparadigmen\nDozent: Prof. Dr.-Ing. Brauer\nRaum: EDV-A101\nUhrzeit-Dauer: 9:15 - 12:30 Uhr (4:00 UE)\nAnmerkung: -",
    },
  };

  const formattedCalendar = calendar.format(mockEvent);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(formattedCalendar._data).toBeDefined();
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(formattedCalendar._data.events[0]._data.summary).toBe(
    "Programmierparadigmen"
  );
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(cal.events()[0]).toBeDefined();
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(cal.events()[0].summary()).toBe("Description 1");
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("formats meetings", () => {
  const formatted = calendar.formatMeeting({ url: "test", password: "test" });
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(formatted.includes("Url: test")).toBe(true);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(formatted.includes("Password: test")).toBe(true);

  const formatted2 = calendar.formatMeeting({ url: "test" });
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(formatted2.includes("Url: test")).toBe(true);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(formatted2.includes("Password: test")).toBe(false);

  const formatted3 = calendar.formatMeeting({ password: "test" });
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(formatted3.includes("Url: test")).toBe(false);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(formatted3.includes("Password: test")).toBe(true);
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("checks event difference", () => {
  const oldCal = {
    1: {
      start: new Date(),
      summary: "summary",
      end: new Date(),
    },
  };

  const newCal = generator();
  newCal.createEvent({
    start: new Date(),
    summary: "summary",
    end: new Date(),
  });

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(calendar.checkEventDifference(oldCal, newCal)).toStrictEqual([]);

  oldCal[1].end = subDays(new Date(), 3);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(calendar.checkEventDifference(oldCal, newCal)).toStrictEqual([
    format(new Date(), "dd.MM.yyyy"),
  ]);

  const newerCal = generator();
  newerCal.createEvent({
    start: addDays(new Date(), 3),
    summary: "summary",
  });

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(calendar.checkEventDifference(oldCal, newerCal)).toStrictEqual([
    format(addDays(new Date(), 3), "dd.MM.yyyy"),
  ]);

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(calendar.checkEventDifference(undefined, undefined)).toStrictEqual([]);
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("Handles meeting information", () => {
  let result = calendar.meetingInformation(undefined, undefined, "A123");
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(result).toEqual({
    url: "SIMPLE_URL",
    password: "SIMPLE_PASSWORD",
  });

  result = calendar.meetingInformation(
    startOfWeek(new Date()),
    undefined,
    "B123"
  );
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(result).toEqual({
    url: "RIGHT_URL",
    password: "RIGHT_PASS",
  });

  result = calendar.meetingInformation(undefined, "REGEX", "C123");
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(result).toEqual({
    regex: "REGEX",
    url: "RIGHT URL",
  });
});
