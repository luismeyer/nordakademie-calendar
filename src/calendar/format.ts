import { format, isEqual } from "date-fns";
import generator, { ICalCalendar } from "ical-generator";
import { CalendarResponse, DateWithTimeZone } from "node-ical";

import { findMeeting } from "./meeting";

export const findSummary = (description: string) => {
  const startString = "Veranstaltung: ";
  const endString = "\nDozent:";

  const startIndex = description.indexOf(startString) + startString.length;
  const endIndex = description.indexOf(endString);
  return description.substring(startIndex, endIndex);
};

const formatSummary = (summary: string) => {
  return summary
    .replace(/([A-Z] [A-Z]\d{3} )/, "")
    .replace(/WP/g, "")
    .trim();
};

export const formatCalendar = (calendar: CalendarResponse, filter?: string) => {
  const calendarGenerator = generator();
  const events = Object.values(calendar);

  events.forEach(({ location, description, start, ...rest }) => {
    if (!description || typeof description !== "string") {
      return;
    }

    if (!start) {
      return;
    }

    const parsedStart = new Date(start as DateWithTimeZone);

    const summary = findSummary(description);
    if (summary.startsWith("WP") && filter && !summary.includes(filter)) {
      return;
    }

    const meeting = findMeeting({
      start: parsedStart,
      description,
      summary,
    });

    const room = location ? `${location}, ` : "";

    calendarGenerator.createEvent({
      ...rest,
      sequence: 0,
      start: parsedStart,
      location: room + "Nordakademie Elmshorn, 25337",
      description: `${meeting ? meeting : ""}${description}`,
      summary: formatSummary(summary),
    });
  });

  return calendarGenerator;
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
