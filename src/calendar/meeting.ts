import fs from "fs";

import { MeetingData } from "../typings";

const meetings = (): MeetingData | undefined => {
  let data = "";

  if (process.env.NODE_ENV === "test") {
    data = fs
      .readFileSync("../../__tests__/mockdata/mock-meetings.json")
      .toString();
  }

  const meetingsPath = "../../resources/meetings.json";
  if (fs.existsSync(meetingsPath)) {
    data = fs.readFileSync(meetingsPath).toString();
  }

  return JSON.parse(data);
};

const formatMeeting = (url?: string, password?: string): string => {
  let result = "";

  if (url) {
    result += `Url: ${url}`;
  }

  if (password) {
    result += `\nPassword: ${password}`;
  }

  return `${result}\n`;
};

export const findMeeting = (params: {
  start?: Date;
  description?: string;
  summary: string;
}) => {
  const { description, start, summary } = params;

  const meetingsData = meetings();
  if (!meetingsData) return "";

  const meetingKeys = Object.keys(meetingsData);
  const key = meetingKeys.find(
    (key) => summary.includes(key) || description?.includes(key)
  );
  if (!key) return;

  const rawMeeting = meetingsData[key];
  let meeting;

  if (rawMeeting.type === "BASIC") {
    meeting = rawMeeting;
  }

  if (rawMeeting.type === "REGEX" && description) {
    meeting = rawMeeting.values.find((m) => description.match(m.regex));
  }

  if (rawMeeting.type === "DAY" && start) {
    meeting = rawMeeting[start.getDay()];
  }

  if (!meeting) return "";
  return formatMeeting(meeting.url, meeting.password);
};
