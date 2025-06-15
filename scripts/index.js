#!/usr/bin/env node
const { execSync } = require("child_process");
const packageJson = require("../package.json");
const { copyFolder } = require("./copy-scss");
const { processDirectory } = require("./replace-jsx");
const readline = require("readline");

async function sleep(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

async function main() {
  const question = (q) =>
    new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question(q, (answer) => {
        resolve(answer);
        rl.close();
      });
    });
  const getUserInput = async (q, def = "", show = true) => {
    if (def && show) {
      q += ` (default ${def}): `;
    }
    const answer = await question(q);
    return answer ? answer.trim().toLowerCase() : def;
  };
  const getUserConfirm = async (q) => {
    q += " (Y|S para aceptar): ";
    const answer = await getUserInput(q, "n", false);
    const confirmacion = ["y", "s"].includes(answer);
    if (!confirmacion) {
      console.log("Cancelado 🚫");
    }
    return confirmacion;
  };
  const isCancel = (answer) => answer === "*";

  if (await getUserConfirm("¿Publicar npm?")) {
    publishPackage();
  }

  if (await getUserConfirm("¿Actualizar en git?")) {
    const branch = await getUserInput("Nombre de la rama: ", "main");
    if (isCancel(branch)) {
      console.log("Operación cancelada 🚫");
    } else {
      gitAutoPush({ name_branch: branch });
    }
  }

  if (await getUserConfirm("¿Publicar gh-pages?")) {
    deployGHPages();
  }

  if (await getUserConfirm("¿Publicar rama de producción?")) {
    const buildBranch = await getUserInput("Nombre de la rama: ", "build-prod");
    if (isCancel(buildBranch)) {
      console.log("Operación cancelada 🚫");
    } else {
      await deployBuild({ PUBLIC_URL: "/", name_branch: buildBranch });
    }
  }

  if(await getUserConfirm("¿Eliminar build y dist?")){
    deleteTempDeploy("build")
    deleteTempDeploy("dist")
  }

  console.log("Operación completada ✅");
}

const ENVIRONMENT_RUNTIME = {
  stdio: "inherit",
  shell: "powershell.exe",
};

function gitAutoPush({ name_branch = "main" }) {
  console.log("Publicando...");
  execSync(`git add .`, ENVIRONMENT_RUNTIME);
  execSync(
    `git commit -m "Actualización, v${packageJson.version}, ${timeStamp()}"`,
    ENVIRONMENT_RUNTIME
  );
  execSync(`git push origin ${name_branch}`, ENVIRONMENT_RUNTIME);
}

function build({ PUBLIC_URL = "/" }) {
  console.log("Construyendo paquete...");
  execSync(
    `npm run build:context --public-url=${PUBLIC_URL}`,
    ENVIRONMENT_RUNTIME
  );
}

function publishPackage() {
  buildPackage();
  publish();

  function publish() {
    console.log("Publicando paquete...");
    execSync(`npm publish --access public`, ENVIRONMENT_RUNTIME);
    execSync(
      `npm version patch --no-git-tag-version --no-git-commit-hooks`,
      ENVIRONMENT_RUNTIME
    );
  }

  function buildPackage() {
    console.log("Construyendo paquete...");
    execSync(`npx babel src/framework --out-dir dist`, ENVIRONMENT_RUNTIME);
    processDirectory("dist");
    copyFolder(
      "../src/framework/themes/rules/scss",
      "../dist/themes/rules/scss"
    );
  }
}

function timeStamp() {
  const data = new Date();
  return [
    data.getFullYear(),
    data.getMonth() + 1,
    data.getDate() + "-",
    data.getHours(),
    data.getMinutes(),
    data.getSeconds(),
  ]
    .map((x) => x.toString().padStart(2, "0"))
    .join("");
}

function cleanTempDeploy() {
  try {
    console.log("Limpiando carpeta temporal...");
    execSync(
      "Remove-Item -Path .\\temp-deploy\\* -Recurse -Force",
      ENVIRONMENT_RUNTIME
    );
  } catch (e) {
    console.log(
      "⚠️  Advertencia: no se pudo limpiar carpeta temp-deploy/*",
      e.message
    );
  }
}

function deleteTempDeploy(name_folder="temp-deploy") {
  try {
    console.log("Elimiando carpeta temporal...");
    execSync(`Remove-Item -Recurse -Force .\\${name_folder}`, ENVIRONMENT_RUNTIME);
  } catch (e) {
    console.warn(
      "Advertencia: no se pudo eliminar carpeta temp-deploy:",
      e.message
    );
  }
}

async function deployBuild({ PUBLIC_URL = "/", name_branch = "build-prod" }) {
  console.log("Deploy de build...", { PUBLIC_URL, name_branch });
  try {
    deleteTempDeploy();

    build({ PUBLIC_URL });
    console.log("Limpiando worktrees huérfanos...");
    execSync("git worktree prune", ENVIRONMENT_RUNTIME);
    console.log("Agregando worktree temporal...");
    execSync("git worktree add -f temp-deploy", ENVIRONMENT_RUNTIME);

    cleanTempDeploy();

    console.log("Copiando build a carpeta temporal...");
    execSync(
      "Copy-Item -Path build\\* -Destination temp-deploy -Recurse -Force",
      ENVIRONMENT_RUNTIME
    );

    console.log("Entrando en temp-deploy...");
    execSync("cd temp-deploy", ENVIRONMENT_RUNTIME);

    try {
      console.log("Eliminando branch build-prod si existe...");
      execSync(`git branch -D ${name_branch}`, ENVIRONMENT_RUNTIME);
    } catch (e) {
      console.log("Branch build-prod no existe.");
    }

    console.log("Creando rama orphan para deploy...");
    execSync(`git checkout --orphan ${name_branch}`, ENVIRONMENT_RUNTIME);
    await sleep(1);

    execSync("git add .", ENVIRONMENT_RUNTIME);
    const fecha = timeStamp();
    execSync(
      `git commit -m "Autodeploy v${packageJson.version} ${fecha}"`,
      ENVIRONMENT_RUNTIME
    );

    console.log("Push forzado a build-prod...");
    execSync(
      `git push origin HEAD:${name_branch} --force`,
      ENVIRONMENT_RUNTIME
    );

    console.log("Volviendo al directorio raíz...");
    execSync("cd ..", ENVIRONMENT_RUNTIME);

    execSync("git checkou main", ENVIRONMENT_RUNTIME);
    await sleep(1);

    deleteTempDeploy();

    console.log("✅ Deploy manual completado.");
  } catch (err) {
    console.error("❌ Error en deploy manual:", err.message);
    process.exit(1);
  }
}

function deployGHPages() {
  build({ PUBLIC_URL: "." });
  execSync(`npm run deploy:gh-pages`, ENVIRONMENT_RUNTIME);
}

main();
