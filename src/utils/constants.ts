import path from "path";

const { IS_LOCAL: LOCAL, IS_OFFLINE } = process.env;

export const IS_LOCAL = LOCAL || IS_OFFLINE;

export const RESOURCES_DIR = path.resolve(__dirname, "../../resources");

export const MODULES_PATH = path.resolve(RESOURCES_DIR, "modules.json");

export const MEETINGS_PATH = path.resolve(RESOURCES_DIR, "meetings.json");

export const MEETINGS_PATH_ENCRYPTED = MEETINGS_PATH + ".gpg";

export const MOCK_MEETINGS_PATH = path.resolve(
  __dirname,
  "../__tests__/mockdata/mock-meetings.json"
);
