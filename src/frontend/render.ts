import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

import { calendarFileNames, toBucketUrl, uploadToS3 } from "../aws/bucket";
import { resourcesDir } from "../utils";

export const renderPage = async () => {
  const templatePath = path.resolve(resourcesDir(), "index.html");
  const templateString = fs.readFileSync(templatePath).toString();

  const fileNames = await calendarFileNames();
  const files = fileNames.map((name) => ({ name, url: toBucketUrl(name) }));

  const template = Handlebars.compile(templateString);
  const page = template({ files });

  return uploadToS3(page, "index.html");
};
