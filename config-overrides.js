const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    "@root": path.resolve(__dirname),
    "@src": path.resolve(__dirname, "src"),
    "@app": path.resolve(__dirname, "src/app"),
    "@framework": path.resolve(__dirname, "src/framework/index.js"),
    "@views": path.resolve(__dirname, "src/views"),
    "@theme": path.resolve(__dirname, "src/app/theme"),
  }),
  (config) => {
    config.resolve.extensions = config.resolve.extensions.concat([
      ".js",
      ".jsx",
      ".mjs",
      ".cjs",
    ]);
    return config;
  }
);
