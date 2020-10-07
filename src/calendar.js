const generator = require("ical-generator");
const { subDays, parseISO, isEqual, format } = require("date-fns");

const meetings = () => {
  try {
    if (process.env.NODE_ENV === "test") {
      return require("../__tests__/mockdata/mock-meetings.json");
    }

    return require("../resources/meetings.json");
  } catch (ex) {
    console.log("No Meeting file found: ", ex);
  }
};

module.exports.formatSummary = (summary) =>
  summary.replace(/([A-Z] [A-Z]\d{3} )|WP /, "");

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

module.exports.meetingInformation = (start, description, summary) => {
  const moduleNumberMatches = summary.match(/\w\d{3}/);
  if (!moduleNumberMatches || !moduleNumberMatches.length) return;

  const meetingsData = meetings();
  const moduleNumber = moduleNumberMatches[0];
  const rawMeeting = meetingsData[moduleNumber];

  let meeting;
  if (!rawMeeting) return;

  if (rawMeeting.url) {
    meeting = rawMeeting;
  }

  if (Array.isArray(rawMeeting)) {
    meeting = rawMeeting.find((m) => description.match(m.regex));
  }

  const date = new Date(start);
  if (date && rawMeeting[date.getDay()]) {
    meeting = rawMeeting[date.getDay()];
  }

  return meeting;
};

module.exports.format = (calendar, filter) => {
  const calendarGenerator = generator();
  const events = Object.values(calendar);

  events.forEach(({ location, description, start, ...rest }) => {
    if (!description) return;

    const summary = this.getSummary(description);
    if (summary.startsWith("WP") && filter && !summary.includes(filter)) {
      return;
    }

    const rawMeeting = this.meetingInformation(start, description, summary);
    const meeting = this.formatMeeting(rawMeeting);

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

    const mainDescription = main ? `🥩  ${main.description} ${main.price}` : "";
    const secondDescription = second
      ? `🥦  ${second.description} ${second.price}`
      : "";

    calendar.createEvent({
      summary: main ? main.description : second.description,
      start: subDays(day, 1),
      end: day,
      description:
        mainDescription +
        (mainDescription && secondDescription ? "\n\n" : "") +
        secondDescription,
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
