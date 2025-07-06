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
    "@components": path.resolve(__dirname, "src/app/theme/components"),
    "@api": path.resolve(__dirname, "src/app/api/index.js"),
    "@tables": path.resolve(__dirname, "src/tables"),
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
