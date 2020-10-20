import fs from "fs";
import path from "path";

import { MeetingData } from "../typings";
import { MEETINGS_PATH, MOCK_MEETINGS_PATH } from "../utils/constants";

const meetings = (): MeetingData | undefined => {
  let data = "";

  const meetingsPath = path.resolve(MEETINGS_PATH);
  if (fs.existsSync(meetingsPath)) {
    data = fs.readFileSync(meetingsPath).toString();
  }

  if (process.env.NODE_ENV === "test") {
    const filePath = MOCK_MEETINGS_PATH;
    data = fs.readFileSync(filePath).toString();
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
    (k) => summary.includes(k) || description?.includes(k)
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
