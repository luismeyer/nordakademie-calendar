'use strict';
const nak = require('./src/nak')
const calendar = require('./src/calendar')
const bucket = require('./src/bucket')

module.exports.formatter = async (event, context, callback) => {
  const currentSemester = nak.currentSemester();
  if (!currentSemester) return;

  const nakCal = await nak.fetchCalendar(currentSemester.semester)
  if (!nakCal) return;

  const ics = calendar.format(nakCal);
  bucket.uploadToS3(ics.toString())
    .then(res => callback(null, res), callback);
};