# Resources 📚

## Modules 🗳

The module data is used to generate different calendar files for each module. It is structured like this:

```json
{
  "modules": [
    {
      "filter": "<FILTER_STRING>",
      "filename": "<URL_SAFE_FILENAME>.ics"
    },
    {
      "filter": "<FILTER_STRING>",
      "filename": "<URL_SAFE_FILENAME>.ics"
    }
  ]
}
```

If module data is provided the formatter will run for every module item in the modules array. The events which contain modules will be filtered, so only one module event series exists in the calendar.

The filenames can be found in the [modules file](modules.json).

By putting together the filename and the S3 Bucket basepath you get the calendar file Url: **https://<BUCKET_NAME>.s3.eu-central-1.amazonaws.com/<FILE_NAME>**

## Meetings 📌

You can add meetings to this folder which will be injected into the event description. Since the meeting data is confidential you have to encrypt the meetings file.

```bash
yarn meetings
```

There are different ways to structure meeting data:

(Notice that \<MODULE\> is a unique string identifying the timetable entry. It is matched against the event description or event summary.)

1. If a module has always the same meeting

   ```json
   {
     "<MODULE>": {
       "url": "<MEETING_URL>",
       "password": "<MEETING_PASSWORD>"
     }
   }
   ```

2. If A module has more than one meeting you can provide an array of meeting-data. The meeting-data has to contain a regex which will be matched with the event description:

   ```json
   {
     "<MODULE>": [
       {
         "regex": "REGEX_1",
         "url": "MEETING_URL_1"
       },
       {
         "regex": "REGEX_2",
         "url": "MEETING_URL_2",
         "password": "MEETING_PASSWORD_2"
       }
     ]
   }
   ```

3. If a module has more than one meeting depending on the day the event takes place . You can structure the meeting data like this. Where the DAY_NUMBER is a number between 0 and 6 (0 equals Sunday).

   ```json
   {
     "<MODULE>": {
       "<DAY_NUMBER>": {
         "url": "<MEETING_URL_1",
         "password": "MEETING_PASSWORD_1"
       },
       "<DAY_NUMBER>": {
         "url": "MEETING_URL_2",
         "password": "MEETING_PASSWORD_2"
       }
     }
   }
   ```
