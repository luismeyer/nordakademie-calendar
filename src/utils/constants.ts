import path from "path";

const { IS_LOCAL: LOCAL, IS_OFFLINE } = process.env;

export const IS_LOCAL = LOCAL || IS_OFFLINE;

export const RESOURCES_DIR = path.resolve(__dirname, "../resources");

export const MEETINGS_PATH = path.resolve(RESOURCES_DIR, "meetings.json");
export const MOCK_MEETINGS_PATH = path.resolve(
  __dirname,
  "../../__tests__/mockdata/mock-meetings.json"
);

export const SECRETS = path.resolve(__dirname, "../../secrets/secrets.json");
export const SECRETS_ENCRYPTED = path.resolve(
  __dirname,
  "../../secrets/secrets.json.gpg"
);

export const MEETINGS = path.resolve(
  __dirname,
  "../../resources/meetings.json"
);
export const MEETINGS_ENCRYPTED = path.resolve(
  __dirname,
  "../../secrets/meetings.json.gpg"
);
