# NAK-Calendar

NAK-Calendar is an AWS Lambda that downloads the current Nordakademie timetable and formates the calendar entries every 6 hours.

## Installation

Install [serverless](https://serverless.com) to manage the AWS deployments
and the package manager npm to install all dependencies.  
Also rename the secrets.example.json file to secrets.json and put in the real credentials.

```bash
npm install
```

## Usage

The handler.js file is the entry point of the AWS Lambda. To invoke the function use:

```bash
npm start
```

## Deployment

All Code will be automatically deployed if a github release is created.  
If you want to deploy from your local machine and if you configured serverless correctly run:

```bash
npm run deploy
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
