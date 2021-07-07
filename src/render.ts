import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { calendarFileNames, toBucketUrl, uploadToS3 } from './aws/bucket';
import { RESOURCES_DIR } from './utils/constants';

export const renderPage = async () => {
  const templatePath = path.resolve(RESOURCES_DIR, "index.html");
  const templateString = fs.readFileSync(templatePath).toString();

  const fileNames = await calendarFileNames();
  const files = fileNames.map((name) => ({ name, url: toBucketUrl(name) }));

  const template = Handlebars.compile(templateString);
  const page = template({ files });

  return uploadToS3(page, "index.html", "text/html");
};
