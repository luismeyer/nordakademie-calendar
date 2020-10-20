import ical from "node-ical";
import fetch from "node-fetch";

import { isValidUrl } from "./utils/html";

export const nakCalendarUrl = (semester: number, centuria?: string) => {
  if (!centuria) {
    const { CENTURIA } = process.env;

    if (!CENTURIA) throw new Error("Missing Environment Variable: CENTURIA");
    centuria = CENTURIA;
  }

  return `https://cis.nordakademie.de/fileadmin/Infos/Stundenplaene/${centuria}_${semester}.ics`;
};

export const fetchCalendar = async (centuria?: string) => {
  for (let i = 1; i < 10; i++) {
    const url = nakCalendarUrl(i, centuria);
    const isValid = await isValidUrl(url);

    if (isValid) {
      return ical
        .fromURL(url)
        .catch((err) => console.error(`From url Error (${url}): ${err}`));
    }
  }

  return;
};

export const fetchMensaTimetable = async () =>
  fetch("https://cis.nordakademie.de/mensa/speiseplan.cmd").then(
    (res) => res.text() as Promise<string>
  );
