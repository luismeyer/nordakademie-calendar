const generator = require("ical-generator");
const { subDays, parseISO, isEqual, format } = require("date-fns");
const { de } = require("date-fns/locale");

const meetings = () => {
  try {
    return require("../resources/meetings.json");
  } catch (ex) {
    console.log("No Meeting file found: ", ex);
  }
};

module.exports.formatSummary = (summary) =>
  summary.replace(/([A-Z] [A-Z]\d{3} )|[A-Z] /, "");

module.exports.getSummary = (description) => {
  if (!description) return;

  const startString = "Veranstaltung: ";
  const endString = "\nDozent:";

  const startIndex = description.indexOf(startString) + startString.length;
  const endIndex = description.indexOf(endString);
  return description.substring(startIndex, endIndex);
};

module.exports.formatMeeting = (meeting) => {
  if (!meeting) return "";
  let result = "";

  if (meeting.url) {
    result += `Url: ${meeting.url}`;
  }

  if (meeting.password) {
    result += `\nPassword: ${meeting.password}`;
  }

  return `${result}\n`;
};

module.exports.meetingInformation = ({ date, meeting, description }) => {
  if (!meeting) return;

  if (meeting.url) {
    return meeting;
  }

  if (Array.isArray(meeting)) {
    return meeting.find((m) => description.match(m.regex));
  }

  if (date && meeting[date.getDay()]) {
    return meeting[date.getDay()];
  }
};

module.exports.format = (calendar) => {
  const calendarGenerator = generator();
  const events = Object.values(calendar);
  const meetingsData = meetings();

  events.forEach(({ location, description, start, ...rest }) => {
    if (!description) return;

    const summary = this.getSummary(description);
    const meetingsMatch = summary.match(/\w\d{3}/);
    let meeting = "";

    if (meetingsMatch && meetingsMatch.length) {
      const meetingData = this.meetingInformation({
        meeting: meetingsData[meetingsMatch[0]],
        date: new Date(start),
        description,
      });

      meeting = this.formatMeeting(meetingData);
    }

    calendarGenerator.createEvent({
      ...rest,
      start,
      location: (location && `${location}, `) + "Nordakademie Elmshorn, 25337",
      description: `${meeting}${description}`,
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
      if (!oldEvent) return false;

      const { start: oldStart, end: oldEnd } = oldEvent;
      const { start: newStart, end: newEnd } = newEvent.toJSON();

      return (
        !isEqual(new Date(oldStart), new Date(newStart)) ||
        !isEqual(new Date(oldEnd), new Date(newEnd))
      );
    })
    .map((event) => format(new Date(event.start()), "dd.MM.yyyy"));
};
