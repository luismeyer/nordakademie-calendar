import path from "path";

const { IS_LOCAL: LOCAL, IS_OFFLINE } = process.env;

export const IS_LOCAL = LOCAL || IS_OFFLINE;

export const RESOURCES_DIR = path.resolve(__dirname, "../resources");
