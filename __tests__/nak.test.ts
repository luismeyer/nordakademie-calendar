// @ts-expect-error ts-migrate(1192) FIXME: Module '"/Users/luis.meyer/Projects/nak-calendar/s... Remove this comment to see the full error message
import nak from "../src/nak";

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("calendar url ends with filename ", () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(nak.calendarUrl(3, "A18b").endsWith("A18b_3.ics")).toBe(true);
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("fetches calendar", async () => {
  const nakCal = await nak.fetchCalendar("A18b");
  if (!nakCal) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(nakCal).toBe(false);
  } else {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(typeof nakCal).toBe("object");
  }
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("catches missing mensa html", () => {
  const formattedTimetable = nak.formatMensaTimetable("");
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(typeof formattedTimetable).toBe("object");
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(formattedTimetable.length).toBe(0);
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("fetches mensa html string", async () => {
  const html = await nak.fetchMensaTimetable();
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(typeof html).toBe("string");
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(html.includes("Speiseplan")).toBe(true);
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("formats mensa html string", async () => {
  const html = await nak.fetchMensaTimetable();
  const mensa = await nak.formatMensaTimetable(html);
  if (!mensa.length) return;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(Array.isArray(mensa)).toBe(true);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(typeof mensa[0].main.description).toBeDefined();
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(mensa[0].date).toBeDefined();
});
