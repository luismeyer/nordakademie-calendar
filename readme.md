# Calendar Formatter

Calendar Formatter is an AWS Lambda that downloads the current Nordakademie timetable and formates the calendar entries every 6 hours.

## Installation

Install [serverless](https://serverless.com) to manage the AWS deployments
and the package manager npm to install all dependencies.

```bash
npm install
```

## Usage

The handler.js file is the entry point of the AWS Lambda. To invoke the function use:

```bash
npm start
```

or

```bash
serverless invoke local -f api
```

## Deployment

If you configured serverless correctly run:

```bash
npm run deploy
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
