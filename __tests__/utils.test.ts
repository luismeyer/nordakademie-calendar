import { isValidUrl, formatInnerHtml } from "../src/utils/html";

test("validates url", async () => {
  expect(await isValidUrl("https://google.com")).toBe(true);
  expect(
    await isValidUrl(
      "https://cis.nordakademie.de/fileadmin/Infos/Stundenplaene/A18b_1.ics"
    )
  ).toBe(false);
});

test("formats innerhtml text", () => {
  expect(formatInnerHtml("          abc             ")).toBe("abc");
});
