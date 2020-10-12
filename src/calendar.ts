import generator, { ICalCalendar } from "ical-generator";
import { subDays, parseISO, isEqual, format } from "date-fns";
import { CalendarResponse, DateWithTimeZone } from "node-ical";

import { MensaWeek } from "./typings";
import { resourcesDir } from "./utils";

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

export const formatSummary = (summary: string) =>
  summary.replace(/([A-Z] [A-Z]\d{3} )|WP /, "");

export const getSummary = (description: string) => {
  const startString = "Veranstaltung: ";
  const endString = "\nDozent:";

  const startIndex = description.indexOf(startString) + startString.length;
  const endIndex = description.indexOf(endString);
  return description.substring(startIndex, endIndex);
};

export const formatMeeting = (meeting?: {
  url: string;
  password?: string;
}): string => {
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

export const meetingInformation = (params: {
  start?: Date;
  description?: string;
  summary: string;
}) => {
  const { description, start, summary } = params;

  const meetingsData = meetings();
  const meetingKeys = Object.keys(meetingsData);

  const key = meetingKeys.find(
    (key) => description?.includes(key) || summary.includes(key)
  );
  if (!key) return;

  const rawMeeting = meetingsData[key];
  let meeting;

  if (rawMeeting.url) {
    meeting = rawMeeting;
  }

  if (Array.isArray(rawMeeting) && description) {
    meeting = rawMeeting.find((m) => description.match(m.regex));
  }

  if (start && rawMeeting[start.getDay()]) {
    meeting = rawMeeting[start.getDay()];
  }

  return meeting;
};

export const formatCalendar = (calendar: CalendarResponse, filter?: string) => {
  const calendarGenerator = generator();
  const events = Object.values(calendar);

  events.forEach(({ location, description, start, ...rest }) => {
    if (!description) return;

    const summary = getSummary(description as string);
    if (summary.startsWith("WP") && filter && !summary.includes(filter)) {
      return;
    }

    const parsedStart = new Date(start as DateWithTimeZone);
    const rawMeeting = meetingInformation({
      start: parsedStart,
      description: description as string,
      summary,
    });
    const meeting = formatMeeting(rawMeeting);

    calendarGenerator.createEvent({
      ...rest,
      sequence: 0,
      start: parsedStart,
      location: (location && `${location}, `) + "Nordakademie Elmshorn, 25337",
      description: `${meeting}${description}`,
      summary: formatSummary(summary),
    });
  });

  return calendarGenerator;
};

export const createMensaEvents = (mensaTimetable: MensaWeek) => {
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

export const checkEventDifference = (
  newCal: ICalCalendar,
  oldCal?: CalendarResponse
) => {
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
        !isEqual(
          new Date(oldStart as DateWithTimeZone),
          new Date(newStart as DateWithTimeZone)
        ) ||
        !isEqual(
          new Date(oldEnd as DateWithTimeZone),
          new Date(newEnd as DateWithTimeZone)
        )
      );
    })

    .map((event) => format(event.start().toDate(), "dd.MM.yyyy"));
};
