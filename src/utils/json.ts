import { readFileSync } from "fs";

export const readJSON = (path: string) =>
  JSON.parse(readFileSync(path).toString());
