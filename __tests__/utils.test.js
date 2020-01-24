const utils = require("../src/utils");

test("validates url", async () => {
    expect(await utils.isValidUrl("https://google.com")).toBe(true);
    expect(await utils.isValidUrl("https://cis.nordakademie.de/fileadmin/Infos/Stundenplaene/A18b_-1.ics")).toBe(false);
})

test("formats innerhtml text", () => {
    expect(utils.formatInnerHtml("          abc             ")).toBe("abc");
});