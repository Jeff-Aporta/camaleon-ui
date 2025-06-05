import fs from "fs";
import path from "path";

const baseDir = process.argv[2];

if (!baseDir) {
  console.error(
    "❌ Debes proporcionar la ruta a la carpeta base. Ejemplo: node replace-jsx.js dist"
  );
  process.exit(1);
}

const absoluteBaseDir = path.resolve(baseDir);

function replaceInFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`❌ Error leyendo ${filePath}: ${err.message}`);
      return;
    }

    const updated = data
      .replace(/(\.\/[\w\/-]+)\.jsx/g, "$1.js")
      .replace(/(\.\/[\w\/-]+)\.mjs/g, "$1.js");

    fs.writeFile(filePath, updated, "utf8", (err) => {
      if (err) {
        console.error(`❌ Error escribiendo ${filePath}: ${err.message}`);
      } else {
        console.log(`✅ Reemplazo completado en: ${filePath}`);
      }
    });
  });
}

function processDirectory(dir) {
  fs.readdir(dir, { withFileTypes: true }, (err, items) => {
    if (err) {
      console.error(`❌ Error leyendo directorio ${dir}: ${err.message}`);
      return;
    }

    items.forEach((item) => {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        processDirectory(fullPath); // Recursivo
      } else if (item.isFile() && fullPath.endsWith(".js")) {
        replaceInFile(fullPath);
      }
    });
  });
}

// Inicia el procesamiento
processDirectory(absoluteBaseDir);
