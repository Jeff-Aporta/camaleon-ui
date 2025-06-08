// Script para ejecutar `npm run build` desde Node.js
const { exec } = require("child_process");

function cmdexec(...cmds) {
  cmds.forEach((cmd) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar build: ${error.message}`);
        process.exit(1);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout:\n${stdout}`);
    });
  });
}

/*
  "transpile": "npx babel src/framework --out-dir dist",
  "replace-jsx": "node scripts/replace-jsx.js dist",
  "copy-scss": "node scripts/copy-scss.js",
  "build-package": "npm run transpile && npm run replace-jsx && npm run copy-scss",

  "version-bump": "npm version patch --no-git-tag-version --no-git-commit-hooks",
  "git-add-commit-push": "git add package.json package-lock.json && git commit -m \"Publica la versión $(node -p \"require('./package.json').version\")\" && git push",

  "publish-package": "npm run build-package && npm publish --access public && npm run version-bump && npm run git-add-commit-push",

  "build-gh": "npm run build-gh-repo --package-repository-url=$(node -p \"require('./package.json').repository.url\")",
  "build-gh-repo": "cross-env-shell \"PUBLIC_URL=. REACT_APP_REPO_URL=\\\"$npm_package_repository_url\\\"\" react-app-rewired build",
  "deploy-gh-pages": "npm run build-gh && gh-pages -d build",
  "deploy-gh": "npm run deploy-gh-pages && npm run publish-package",

  "deploy-branch": "npm run deploy-branch-repo --package-repository-url=$(node -p \"require('./package.json').repository.url\")",
  "deploy-branch-repo": "cross-env-shell \"PUBLIC_URL=/ REACT_APP_REPO_URL=\\\"$npm_package_repository_url\\\"\" npm run build && gh-pages -d build -b %npm_config_branch%",
  "deploy-prod": "npm run deploy-branch --branch=build-prod",

  "deploys": "npm run deploy-gh && npm run deploy-prod"
*/

const packageJson = require("../package.json");

const repository_url = packageJson.repository.url;

const transpile = "npx babel src/framework --out-dir dist";
const replaceJsx = "node scripts/replace-jsx.js dist";
const copyScss = "node scripts/copy-scss.js";

const buildPackage = `${transpile} && ${replaceJsx} && ${copyScss}`;
const versionBump =
  "npm version patch --no-git-tag-version --no-git-commit-hooks";
const gitAddCommitPush = `git add package.json package-lock.json && git commit -m \\"Publica la versión $(node -p \\"require('./package.json').version\\")\\" && git push`;

const envvars = (public_) => `cross-env-shell PUBLIC_URL=${public_}`;
const publishPackage = `${buildPackage} && npm publish --access public && ${versionBump} && ${gitAddCommitPush}`;
const buildGhRepo = `${envvars(".")} react-app-rewired build`;
const deployGhPages = `${buildGhRepo} && gh-pages -d build`;
const deployGh = `${deployGhPages} && ${publishPackage}`;
const deployBranch = (branch) =>
  `${envvars("/")} npm run build && gh-pages -d build -b ${branch}`;
const deployProd = deployBranch("build-prod");
const deploys = `${deployGh} && ${deployProd}`;

console.log(deploys);
