import fetch from "node-fetch";
import ical from "node-ical";
import { timeoutPromise } from "./utils/fetch";

import { isValidUrl } from "./utils/html";

export const nakCalendarUrl = (semester: number, centuria?: string) => {
  if (!centuria) {
    const { CENTURIA } = process.env;

    if (!CENTURIA) {
      throw new Error("Missing Environment Variable: CENTURIA");
    }

    centuria = CENTURIA;
  }

  return `https://cis.nordakademie.de/fileadmin/Infos/Stundenplaene/${centuria}_${semester}.ics`;
};

export const fetchCalendar = async (
  centuria?: string
): Promise<undefined | ical.CalendarResponse> => {
  for (let i = 1; i < 10; i++) {
    const url = nakCalendarUrl(i, centuria);
    const isValid = await isValidUrl(url);

    if (isValid) {
      const result = await timeoutPromise(ical.fromURL(url)).catch((err) => {
        console.error(`From url Error (${url}): ${err}`);
        return undefined;
      });

      return result;
    }
  }

  return;
};

export const fetchMensaTimetable = async (): Promise<string | undefined> => {
  return timeoutPromise(
    fetch("https://cis.nordakademie.de/mensa/speiseplan.cmd")
  ).then((res) => res?.text());
};
