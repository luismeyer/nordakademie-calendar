import { fetchCalendar, fetchMensaTimetable, nakCalendarUrl } from "../src/nak";

test("calendar url ends with filename ", () => {
  expect(nakCalendarUrl(3, "A18b").endsWith("A18b_3.ics")).toBe(true);
});

test("fetches calendar", async () => {
  const nakCal = await fetchCalendar("A18b");
  if (!nakCal) {
    expect(Boolean(nakCal)).toBe(false);
  } else {
    expect(typeof nakCal).toBe("object");
  }
});

test("fetches mensa html string", async () => {
  const html = await fetchMensaTimetable();
  expect(typeof html).toBe("string");
  expect(html.includes("Speiseplan")).toBe(true);
});
