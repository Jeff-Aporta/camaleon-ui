import { copyFolder } from "../src/framework/tools/scripts/updater/copy-scss.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sass_framework = path.resolve(__dirname, "..", "src", "framework");
const sass_dist = path.resolve(__dirname, "..", "dist");

copyFolder(sass_framework, sass_dist);
