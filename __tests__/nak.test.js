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

  const nakCal = await nak.fetchCalendar(currentSemester.semester)
  expect(typeof nakCal).toBe("object")
})

test("catches missing semester fetch", async () => {
  const nakCal = await nak.fetchCalendar(-1)
  expect(typeof nakCal).toBe("object")
})