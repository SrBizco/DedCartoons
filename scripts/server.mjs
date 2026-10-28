import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve } from 'node:path';

const root = process.cwd();
const port = 4173;
const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.wasm': 'application/wasm',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
};

createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  const filePath = resolve(root, relativePath);

  if (!filePath.startsWith(`${root}\\`) || !existsSync(filePath)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  const isBrotliCompressed = extname(filePath) === '.br';
  const uncompressedPath = isBrotliCompressed ? filePath.slice(0, -3) : filePath;
  const headers = {
    'Content-Type': mimeTypes[extname(uncompressedPath)] ?? 'application/octet-stream',
  };

  if (isBrotliCompressed) {
    headers['Content-Encoding'] = 'br';
  }

  response.writeHead(200, headers);
  createReadStream(filePath).pipe(response);
}).listen(port, () => {
  console.log(`Ded Cartoons disponible en http://localhost:${port}`);
});
