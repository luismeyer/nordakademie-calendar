const generator = require("ical-generator");
const {
  subDays,
  parseISO,
  isEqual,
  format
} = require("date-fns");

module.exports.formatSummary = summary => {
  const firstComma = summary.indexOf(",") + 1;
  const secondComma = summary.indexOf(",", firstComma + 1);
  return summary
    .substr(firstComma, secondComma - firstComma)
    .replace(/([A-Z] [A-Z]\d{3} )|[A-Z] /, "");
};

module.exports.format = (calendar, oldEvents) => {
  const cal = generator();
  const events = Object.values(calendar);

  events.forEach(({
    summary,
    location,
    ...rest
  }) => {
    if (!summary) return;

    cal.createEvent({
      ...rest,
      location: `${location}, Nordakademie Elmshorn, 25337`,
      summary: this.formatSummary(summary)
    });
  });

  return cal;
};

module.exports.createMensaEvents = (calendar, mensaTimetable) => {
  mensaTimetable.forEach(({
    main,
    second,
    date
  }) => {
    const day = parseISO(date);

    calendar.createEvent({
      summary: main.description,
      start: subDays(day, 1),
      end: day,
      description: `🥩 ${main.description} (${main.price}) \n\n🥦 ${second.description} (${second.price})`,
      location: 'Mensa',
    })
  })
}

module.exports.checkEventDifference = (oldCal, newCal) => {
  if (!oldCal) return [];

  const oldEvents = Object.values(oldCal);
  const newEvents = newCal.events();

  return newEvents
    .filter((newEvent, index) => {
      const oldEvent = oldEvents[index];
      const {
        start: oldStart,
        end: oldEnd
      } = oldEvent;
      const {
        start: newStart,
        end: newEnd
      } = newEvent.toJSON();

      return !isEqual(new Date(oldStart), new Date(newStart)) || !isEqual(new Date(oldEnd), new Date(newEnd));
    })
    .map(event => format(new Date(event.start(), "dd.MM.yyyy")));
}