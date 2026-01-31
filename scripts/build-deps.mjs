import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

const jsOutDir = path.join(root, 'src/site/assets/js');
const cssOutDir = path.join(root, 'src/site/assets/css');

const jsDeps = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/@popperjs/core/dist/umd/popper.min.js',
  'node_modules/bootstrap/dist/js/bootstrap.min.js',
  'node_modules/datatables.net/js/dataTables.min.js',
  'node_modules/datatables.net-bs5/js/dataTables.bootstrap5.min.js',
  'node_modules/datatables.net-buttons/js/dataTables.buttons.min.js',
  'node_modules/datatables.net-buttons/js/buttons.html5.min.js',
  'node_modules/datatables.net-buttons-bs5/js/buttons.bootstrap5.min.js',
];

const cssDeps = [
  'node_modules/datatables.net-bs5/css/dataTables.bootstrap5.css',
  'node_modules/datatables.net-buttons-bs5/css/buttons.bootstrap5.css',
];

async function concatFiles(relativePaths) {
  const parts = await Promise.all(
    relativePaths.map(async (p) => {
      const abs = path.join(root, p);
      return fs.readFile(abs, 'utf8');
    }),
  );
  return `${parts.join('\n')}\n`;
}

async function main() {
  await fs.mkdir(jsOutDir, { recursive: true });
  await fs.mkdir(cssOutDir, { recursive: true });

  const js = await concatFiles(jsDeps);
  const css = await concatFiles(cssDeps);

  await fs.writeFile(path.join(jsOutDir, 'deps.js'), js);
  await fs.writeFile(path.join(cssOutDir, 'deps.css'), css);
}

main().catch((error) => {
  throw error;
});
