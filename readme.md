# NAK-Calendar 📆

NAK-Calendar is an AWS Lambda that downloads the current Nordakademie timetable and formates the calendar entries every 6 hours.

## Usage

The calendar files can be accessed over the AWS S3 Url which looks like this: https://<BUCKET_NAME>.s3.eu-central-1.amazonaws.com/<FILE_NAME>. You can either download the file from there or subscribe to the Url using for example [Outlook](https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-on-the-web-503ffaf6-7b86-44fe-8dd6-8099d95f38df) or [Google](https://support.google.com/calendar/answer/37100).

## Installation and Setup

Install [serverless](https://serverless.com) to manage the AWS deployments
and the package manager yarn.

```bash
yarn
```

Rename the secrets.example.json file to secrets.json and put in the real credentials.

If you want to use the bot notification and the meeting feature you have to run the setup script with your AWS Lambda Url set in the secrets file.

```bash
yarn setup
```

## Usage

The handler.js file is the entry point of the AWS Lambda. To invoke the function use:

```bash
yarn invoke:timetable
```

or

```bash
yarn invoke:mensa
```

## Deployment

All Code will be automatically deployed if a github release is created.  
If you want to deploy from your local machine and if you configured serverless correctly run:

```bash
serverless deploy
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
