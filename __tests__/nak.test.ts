import {
  fetchCalendar,
  calendarUrl,
  formatMensaTimetable,
  fetchMensaTimetable,
} from "../src/nak";

test("calendar url ends with filename ", () => {
  expect(calendarUrl(3, "A18b").endsWith("A18b_3.ics")).toBe(true);
});

test("fetches calendar", async () => {
  const nakCal = await fetchCalendar("A18b");
  if (!nakCal) {
    expect(nakCal).toBe(false);
  } else {
    expect(typeof nakCal).toBe("object");
  }
});

test("catches missing mensa html", () => {
  const formattedTimetable = formatMensaTimetable("");
  expect(typeof formattedTimetable).toBe("object");
  expect(formattedTimetable.length).toBe(0);
});

test("fetches mensa html string", async () => {
  const html = await fetchMensaTimetable();
  expect(typeof html).toBe("string");
  expect(html.includes("Speiseplan")).toBe(true);
});

test("formats mensa html string", async () => {
  const html = await fetchMensaTimetable();
  const mensa = formatMensaTimetable(html);
  if (!mensa.length) return;

  expect(Array.isArray(mensa)).toBe(true);
  expect(typeof mensa[0].main.description).toBeDefined();
  expect(mensa[0].date).toBeDefined();
});
