/**
 * Postinstall script: Patch html2canvas para suportar oklch() (Tailwind CSS v4)
 * 
 * html2canvas v1.4.1 não suporta cores no formato oklch() e lança um erro fatal.
 * Este script substitui o throw por um fallback de cor cinza neutro (#6b7280).
 */

const fs = require('fs');
const path = require('path');

const PATCH_TARGET = 'Attempting to parse an unsupported color function';
const FALLBACK_COMMENT = '// fallback for oklch/oklab/lab/lch (patched by postinstall)';

const filesToPatch = [
  'node_modules/html2canvas/dist/lib/css/types/color.js',
  'node_modules/html2canvas/dist/html2canvas.esm.js',
  'node_modules/html2canvas/dist/html2canvas.js',
];

let patchedCount = 0;

filesToPatch.forEach((filePath) => {
  const fullPath = path.resolve(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`⏭️  [patch] Arquivo não encontrado (ignorando): ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');

  if (content.includes(FALLBACK_COMMENT)) {
    console.log(`✅ [patch] Já patcheado: ${filePath}`);
    return;
  }

  if (!content.includes(PATCH_TARGET)) {
    console.log(`⏭️  [patch] Texto alvo não encontrado: ${filePath}`);
    return;
  }

  // Substitui o throw por um return com fallback
  content = content.replace(
    /throw new Error\("Attempting to parse an unsupported color function[^"]*"[^)]*\);/g,
    `return pack(107, 114, 128, 1); ${FALLBACK_COMMENT}`
  );

  // Fallback para variações de aspas
  content = content.replace(
    /throw new Error\('Attempting to parse an unsupported color function[^']*'[^)]*\);/g,
    `return pack(107, 114, 128, 1); ${FALLBACK_COMMENT}`
  );

  fs.writeFileSync(fullPath, content, 'utf-8');
  patchedCount++;
  console.log(`🔧 [patch] Patcheado com sucesso: ${filePath}`);
});

console.log(`\n✅ html2canvas oklch patch: ${patchedCount} arquivo(s) corrigido(s).`);
