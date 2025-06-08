import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function copyFile(src, dest) {
  const srcPath = path.resolve(__dirname, src);
  const destPath = path.resolve(__dirname, dest);
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`${path.basename(srcPath)} copiado en ${path.relative(__dirname, destPath)} exitosamente.`);
  } catch (err) {
    console.error(`Error copiando ${path.basename(srcPath)}:`, err);
    process.exit(1);
  }
}

export function copyFolder(src, dest) {
  const srcDir = path.resolve(__dirname, src);
  const destDir = path.resolve(__dirname, dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.readdirSync(srcDir).forEach((item) => {
    const srcItem = path.join(srcDir, item);
    const destItem = path.join(destDir, item);
    if (fs.lstatSync(srcItem).isDirectory()) {
      copyFolder(srcItem, destItem);
    } else {
      copyFile(srcItem, destItem);
    }
  });
}

copyFolder('../src/framework/themes/rules/scss', '../dist/themes/rules/scss');
