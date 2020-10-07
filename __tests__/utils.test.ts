// @ts-expect-error ts-migrate(1192) FIXME: Module '"/Users/luis.meyer/Projects/nak-calendar/s... Remove this comment to see the full error message
import utils from "../src/utils";

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("validates url", async () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(await utils.isValidUrl("https://google.com")).toBe(true);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(
    await utils.isValidUrl(
      "https://cis.nordakademie.de/fileadmin/Infos/Stundenplaene/A18b_-1.ics"
    )
  ).toBe(false);
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("formats innerhtml text", () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
  expect(utils.formatInnerHtml("          abc             ")).toBe("abc");
});
