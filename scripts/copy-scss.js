import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Función para copiar un archivo desde src hacia dist
export function copyScss(src, dist) {
  const srcFile = path.resolve(__dirname, src);
  const distDir = path.resolve(__dirname, dist);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  const destFile = path.join(distDir, path.basename(src));
  try {
    fs.copyFileSync(srcFile, destFile);
    console.log(`${path.basename(src)} copiado en ${dist} exitosamente.`);
  } catch (err) {
    console.error(`Error copiando ${path.basename(src)}:`, err);
    process.exit(1);
  }
}

// Uso por defecto para fx.scss
copyScss('../src/framework/themes/fx.scss', '../dist/themes');