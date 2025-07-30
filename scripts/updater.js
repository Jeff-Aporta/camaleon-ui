import { updater_cmd, config_updater_cmd, packageJson_updater_cmd, setDirectory } from "../src/framework/tools/scripts/updater/main.js";
import packageJson from "../package.json" with { type: "json" };
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


packageJson_updater_cmd(packageJson);
config_updater_cmd({
  framework: path.resolve(__dirname, "..", "src", "framework"),
  dist: path.resolve(__dirname, "..", "dist"),
  sass_framework: path.resolve(__dirname, "..", "src", "framework"),
  sass_dist: path.resolve(__dirname, "..", "dist")
});

setDirectory(path.resolve(__dirname, ".."));

updater_cmd({
  publish: true,
  git: true,
  ghPages: true,
  buildProd: true,
  deleteBuild: true,
  deleteDist: true,
});
