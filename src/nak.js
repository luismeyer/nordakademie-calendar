const ical = require("node-ical");
const {
  parseISO,
  isWithinInterval
} = require("date-fns")

module.exports.calendarUrl = (semester) => `https://cis.nordakademie.de/fileadmin/Infos/Stundenplaene/A18b_${semester}.ics`

const SEMESTERS = require('../semesters.json')
module.exports.currentSemester = (semesters = SEMESTERS) => semesters.find(({
  start,
  end
}) => isWithinInterval(new Date(), {
  start: parseISO(start),
  end: parseISO(end)
}))

module.exports.fetchCalendar = (semester) => {
  return ical.fromURL(this.calendarUrl(semester))
    .catch(() => ({}))
}