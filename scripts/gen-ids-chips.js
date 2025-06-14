// scripts/gen-ids-chips.js
// Genera un archivo estático con idsChips para events.ids.js
const fs = require('fs');
const path = require('path');
const inputFile = path.resolve(__dirname, '../src/framework/events/events.ids.js');
const outputFile = path.resolve(__dirname, '../src/views/doc/events/idsChipsStatic.js');
const content = fs.readFileSync(inputFile, 'utf-8');
// Extrae líneas con "export const"
const lines = content.split(/\r?\n/).filter(l => l.startsWith('export const '));
const entries = lines.map(line => {
  const m = line.match(/export const ([A-Z0-9_]+) = (\d+);/);
  if (!m) return null;
  const [_, key, val] = m;
  const title = key;
  const desc = `Constante numérica ${val} para la tecla ${key.replace(/_/g, ' ').toLowerCase()}.`;
  return `  { title: '${title}', title_text: '${title}', text: <>${desc}</>, button_text: 'Cerrar', variant: 'body1' },`;
}).filter(Boolean);
const arrayCode = `// Este archivo es generado automáticamente. No editar manualmente.
export const idsChips = [
${entries.join('\n')}
];
`;
fs.writeFileSync(outputFile, arrayCode, 'utf-8');
console.log(`idsChips estáticos generados en ${outputFile}`);
