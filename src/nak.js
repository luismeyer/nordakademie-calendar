const ical = require("node-ical");
const {
  parseISO,
  isWithinInterval
} = require("date-fns")

const semesters = require('../semesters.json')

const calendarUrl = (semester) => `https://cis.nordakademie.de/fileadmin/Infos/Stundenplaene/A18b_${semester}.ics`

module.exports.fetchCalendar = (semester) => {
  console.info("Fetching Nordakademie timetable");
  return ical.fromURL(calendarUrl(semester))
    .catch(() => console.info("Nordakademie timetable not found"))
}

module.exports.currentSemester = () => {
  const currentSemester = semesters.find(({
    start,
    end
  }) => isWithinInterval(new Date(), {
    start: parseISO(start),
    end: parseISO(end)
  }))

  if (!currentSemester) console.info("No Semester found");
  return currentSemester;
}