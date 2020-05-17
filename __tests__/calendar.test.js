const calendar = require("../src/calendar");
const generator = require("ical-generator");
const { subDays, format, addDays } = require("date-fns");

test("splits string at first and second comma", () => {
  expect(calendar.formatSummary("a,b,c")).toBe("b");
});

test("removes module id", () => {
  expect(calendar.formatSummary(",V A112 Algorithmen&Datenstrukturen,")).toBe(
    "Algorithmen&Datenstrukturen"
  );
});

test("skips missing summarys", () => {
  const mockEvent = {
    event: {
      summary: undefined,
    },
  };

  expect(calendar.format(mockEvent)).toBeDefined();
});

test("formats calendar object", () => {
  const mockEvent = {
    event: {
      summary:
        "A18b,V A112 Algorithmen&Datenstrukturen,Dipl.-Wirtschaftsinf. (FH) R�der,A103,13:00 - 16:15 Uhr (4:00 UE),",
    },
  };

  const formattedCalendar = calendar.format(mockEvent);
  expect(formattedCalendar._data).toBeDefined();
  expect(formattedCalendar._data.events[0]._data.summary).toBe(
    "Algorithmen&Datenstrukturen"
  );
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
});

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

  expect(calendar.checkEventDifference(oldCal, newCal)).toStrictEqual([]);

  oldCal[1].end = subDays(new Date(), 3);
  expect(calendar.checkEventDifference(oldCal, newCal)).toStrictEqual([
    format(new Date(), "dd.MM.yyyy"),
  ]);

  const newerCal = generator();
  newerCal.createEvent({
    start: addDays(new Date(), 3),
    summary: "summary",
  });

  expect(calendar.checkEventDifference(oldCal, newerCal)).toStrictEqual([
    format(addDays(new Date(), 3), "dd.MM.yyyy"),
  ]);

  expect(calendar.checkEventDifference(undefined, undefined)).toStrictEqual([]);
});
