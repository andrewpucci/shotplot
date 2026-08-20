import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { createServer } from 'node:http';

const host = '127.0.0.1';
const port = Number(process.env.PORT || 4173);
const rootDir = normalize(join(process.cwd(), 'dist'));

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

const resolvePath = (urlPath) => {
  const pathname = decodeURIComponent(new URL(urlPath, `http://${host}:${port}`).pathname);
  const candidate = pathname.endsWith('/')
    ? join(rootDir, pathname, 'index.html')
    : join(rootDir, pathname);

  if (!candidate.startsWith(rootDir)) {
    return null;
  }

  if (existsSync(candidate) && statSync(candidate).isFile()) {
    return candidate;
  }

  const directoryIndex = join(candidate, 'index.html');
  if (existsSync(directoryIndex) && statSync(directoryIndex).isFile()) {
    return directoryIndex;
  }

  return null;
};

createServer((request, response) => {
  const filePath = resolvePath(request.url || '/');

  if (!filePath) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream',
  });
  createReadStream(filePath).pipe(response);
}).listen(port, host, () => {
  process.stdout.write(`shotplot test server listening on http://${host}:${port}\n`);
});
