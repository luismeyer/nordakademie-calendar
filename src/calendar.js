const generator = require("ical-generator");

module.exports.format = (calendar) => {
  console.info("Start Calendar formatting");

  const cal = generator();
  const events = Object.values(calendar);

  events.forEach(({
    summary,
    ...rest
  }) => {
    if (!summary) return;
    const firstComma = summary.indexOf(",") + 1;
    const secondComma = summary.indexOf(",", firstComma + 1);
    const newSummary = summary
      .substr(firstComma, secondComma - firstComma)
      .replace(/([A-Z] [A-Z]\d{3} )|[A-Z] /, "");

    cal.createEvent({
      ...rest,
      summary: newSummary
    });
  });

  console.info("Finish Calendar formatting");
  return cal;
}