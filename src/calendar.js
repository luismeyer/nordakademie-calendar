const generator = require("ical-generator");
const { subDays, parseISO, isEqual, format } = require("date-fns");
const fs = require("fs");
const path = require("path");

const meetings = () => {
  const meetingsPath = path.resolve(__dirname, "../resources/meetings.json");
  if (!fs.existsSync(meetingsPath)) {
    console.info("No Meeting file found");
    return;
  }

  console.info("Parsing meetings...");
  return JSON.parse(fs.readFileSync(meetingsPath));
};

module.exports.formatSummary = (summary) => {
  const firstComma = summary.indexOf(",") + 1;
  const secondComma = summary.indexOf(",", firstComma + 1);
  return summary
    .substr(firstComma, secondComma - firstComma)
    .replace(/([A-Z] [A-Z]\d{3} )|[A-Z] /, "");
};

module.exports.formatMeeting = (meeting) =>
  `Url: ${meeting.url} \nPassword: ${meeting.password}`;

const meetingInformation = (moduleId, date, meetings) => {
  if (!moduleId || !meetings) return;

  const meeting = meetings[moduleId];
  if (!meeting) return;
  return this.formatMeeting(meeting.url ? meeting : meeting[date.getDay()]);
};

module.exports.format = (calendar) => {
  const calendarGenerator = generator();
  const events = Object.values(calendar);

  events.forEach(({ summary, location, description, ...rest }) => {
    if (!summary) return;

    const [moduleId] = summary.match(/\w\d{3}/);
    const meeting = meetingInformation(
      moduleId,
      new Date(rest.start),
      meetings()
    );

    calendarGenerator.createEvent({
      ...rest,
      location: `${location}, Nordakademie Elmshorn, 25337`,
      description: `${meeting ? `${meeting}\n` : ""}${description}`,
      summary: this.formatSummary(summary),
    });
  });

  return calendarGenerator;
};

module.exports.createMensaEvents = (mensaTimetable) => {
  const calendar = generator();

  mensaTimetable.forEach(({ main, second, date }) => {
    const day = parseISO(date);

    calendar.createEvent({
      summary: main.description,
      start: subDays(day, 1),
      end: day,
      description: `🥩 ${main.description} (${main.price}) \n\n🥦 ${second.description} (${second.price})`,
      location: "Mensa",
    });
  });

  return calendar;
};

module.exports.checkEventDifference = (oldCal, newCal) => {
  if (!oldCal) return [];

  const oldEvents = Object.values(oldCal);
  const newEvents = newCal.events();

  return newEvents
    .filter((newEvent, index) => {
      const oldEvent = oldEvents[index];
      const { start: oldStart, end: oldEnd } = oldEvent;
      const { start: newStart, end: newEnd } = newEvent.toJSON();

      return (
        !isEqual(new Date(oldStart), new Date(newStart)) ||
        !isEqual(new Date(oldEnd), new Date(newEnd))
      );
    })
    .map((event) => format(new Date(event.start()), "dd.MM.yyyy"));
};
