import generator from "ical-generator";
// @ts-expect-error ts-migrate(2395) FIXME: Individual declarations in merged declaration 'for... Remove this comment to see the full error message
import { subDays, parseISO, isEqual, format } from "date-fns";

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

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'summary' implicitly has an 'any' type.
export const formatSummary = (summary) =>
  summary.replace(/([A-Z] [A-Z]\d{3} )|WP /, "");

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'description' implicitly has an 'any' ty... Remove this comment to see the full error message
export const getSummary = (description) => {
  if (!description) return;

  const startString = "Veranstaltung: ";
  const endString = "\nDozent:";

  const startIndex = description.indexOf(startString) + startString.length;
  const endIndex = description.indexOf(endString);
  return description.substring(startIndex, endIndex);
};

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'meeting' implicitly has an 'any' type.
export const formatMeeting = (meeting) => {
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

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'start' implicitly has an 'any' type.
export const meetingInformation = (start, description, summary) => {
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

// @ts-expect-error ts-migrate(2395) FIXME: Individual declarations in merged declaration 'for... Remove this comment to see the full error message
export const format = (calendar, filter) => {
  const calendarGenerator = generator();
  const events = Object.values(calendar);

  // @ts-expect-error ts-migrate(2345) FIXME: Type 'unknown' is not assignable to type '{ [x: st... Remove this comment to see the full error message
  events.forEach(({ location, description, start, ...rest }) => {
    if (!description) return;

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    const summary = this.getSummary(description);
    if (summary.startsWith("WP") && filter && !summary.includes(filter)) {
      return;
    }

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    const rawMeeting = this.meetingInformation(start, description, summary);
    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    const meeting = this.formatMeeting(rawMeeting);

    calendarGenerator.createEvent({
      ...rest,
      start,
      location: (location && `${location}, `) + "Nordakademie Elmshorn, 25337",
      description: `${meeting}${description}`,
      // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
      summary: this.formatSummary(summary),
    });
  });

  return calendarGenerator;
};

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'mensaTimetable' implicitly has an 'any'... Remove this comment to see the full error message
export const createMensaEvents = (mensaTimetable) => {
  const calendar = generator();

  // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'main' implicitly has an 'any' typ... Remove this comment to see the full error message
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

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'oldCal' implicitly has an 'any' type.
export const checkEventDifference = (oldCal, newCal) => {
  if (!oldCal) return [];

  const oldEvents = Object.values(oldCal);
  const newEvents = newCal.events();

  return newEvents
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'newEvent' implicitly has an 'any' type.
    .filter((newEvent, index) => {
      const oldEvent = oldEvents[index];
      if (!oldEvent) return false;

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'start' does not exist on type 'unknown'.
      const { start: oldStart, end: oldEnd } = oldEvent;
      const { start: newStart, end: newEnd } = newEvent.toJSON();

      return (
        !isEqual(new Date(oldStart), new Date(newStart)) ||
        !isEqual(new Date(oldEnd), new Date(newEnd))
      );
    })
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'event' implicitly has an 'any' type.
    .map((event) => format(new Date(event.start()), "dd.MM.yyyy"));
};
