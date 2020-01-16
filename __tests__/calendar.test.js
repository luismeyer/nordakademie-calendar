const calendar = require("../src/calendar");

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
      summary: undefined
    }
  };

  expect(calendar.format(mockEvent)).toBeDefined();
});

test("formats calendar object", () => {
  const mockEvent = {
    event: {
      summary:
        "A18b,V A112 Algorithmen&Datenstrukturen,Dipl.-Wirtschaftsinf. (FH) R�der,A103,13:00 - 16:15 Uhr (4:00 UE),"
    }
  };

  const formattedCalendar = calendar.format(mockEvent);
  expect(formattedCalendar._data).toBeDefined();
  expect(formattedCalendar._data.events[0]._data.summary).toBe(
    "Algorithmen&Datenstrukturen"
  );
});
