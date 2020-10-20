import { startOfWeek } from "date-fns";

import { findMeeting } from "../../src/calendar/meeting";

test("Handles meeting information", () => {
  let result = findMeeting({ summary: "A123" });
  expect(result).toContain("Url: SIMPLE_URL");
  expect(result).toContain("Password: SIMPLE_PASSWORD");

  result = findMeeting({
    start: startOfWeek(new Date()),
    summary: "B123",
  });
  expect(result).toContain("Url: RIGHT_URL");
  expect(result).toContain("Password: RIGHT_PASS");

  result = findMeeting({ description: "REGEX", summary: "C123" });
  expect(result).toContain("Url: RIGHT_URL");
});
