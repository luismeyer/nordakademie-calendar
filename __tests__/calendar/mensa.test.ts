import {
  formatMensaTimetable,
  createMensaEvents,
} from "../../src/calendar/mensa";
import { fetchMensaTimetable } from "../../src/nak";

test("formatMensaTimetable: catches missing mensa html", () => {
  const formattedTimetable = formatMensaTimetable("");
  expect(typeof formattedTimetable).toBe("object");
  expect(formattedTimetable.length).toBe(0);
});

test("formatMensaTimetable: formats mensa html string", async () => {
  const html = await fetchMensaTimetable();
  const mensa = formatMensaTimetable(html);
  if (!mensa.length) return;

  expect(Array.isArray(mensa)).toBe(true);
  expect(typeof mensa[0].main.description).toBeDefined();
  expect(mensa[0].date).toBeDefined();
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

  const cal = createMensaEvents(mockMensa);
  expect(cal.events()[0]).toBeDefined();
  expect(cal.events()[0].summary()).toBe("Description 1");
});
