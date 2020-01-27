const nak = require("../src/nak");
const {
  subWeeks,
  addWeeks,
  formatISO
} = require("date-fns")

test("calendar url ends with filename ", () => {
  expect(nak.calendarUrl(3).endsWith('A18b_3.ics')).toBe(true);
})

test("finds current semester", () => {
  const semesters = [{
    "start": "2019-01-07",
    "end": "2019-03-15",
    "semester": 1
  }, ]

  expect(nak.currentSemester(semesters)).toBe(undefined);
  expect(nak.currentSemester([...semesters, {
    "start": formatISO(subWeeks(new Date(), 3)),
    "end": formatISO(addWeeks(new Date(), 3)),
    "semester": 2
  }, ]).semester).toBe(2);
})

test("fetches calendar", async () => {
  const currentSemester = nak.currentSemester();
  if (!currentSemester) return;

  const nakCal = await nak.fetchCalendar(currentSemester.semester);
  expect(typeof nakCal).toBe("object");
})

test("catches missing semester fetch", async () => {
  const nakCal = await nak.fetchCalendar(-1);
  expect(nakCal).toBe(undefined);
})

test("catches missing mensa html", () => {
  const formattedTimetable = nak.formatMensaTimetable("");
  expect(typeof formattedTimetable).toBe("object");
  expect(formattedTimetable.length).toBe(0);
})

test("fetches mensa html string", async () => {
  const html = await nak.fetchMensaTimetable();
  expect(typeof html).toBe("string");
  expect(html.includes("Speiseplan")).toBe(true);
})

test("formats mensa html string", async () => {
  const html = await nak.fetchMensaTimetable();
  const mensa = await nak.formatMensaTimetable(html);

  expect(Array.isArray(mensa)).toBe(true);
  expect(typeof mensa[0].main.description).toBeDefined();

  const now = new Date();
  expect(mensa[0].date).toBeDefined();
})