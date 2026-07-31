import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.PORT || 4318);
const rootDirectory = fileURLToPath(new URL('.', import.meta.url));
const designSystemDirectory = resolve(rootDirectory, 'design-system');

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

const securityHeaders = {
  'cache-control': 'public, max-age=300',
  'content-security-policy': "default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  'cross-origin-opener-policy': 'same-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'referrer-policy': 'no-referrer',
  'x-content-type-options': 'nosniff',
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://dotzari.local');

  if (url.pathname === '/health') {
    response.writeHead(200, {
      'cache-control': 'no-store',
      'content-type': 'application/json; charset=utf-8',
      'x-content-type-options': 'nosniff',
    });
    response.end('{"ok":true}');
    return;
  }

  if ((url.pathname === '/' || url.pathname === '/index.html')
    && (request.method === 'GET' || request.method === 'HEAD')) {
    const html = await readFile(new URL('./index.html', import.meta.url));
    response.writeHead(200, {
      ...securityHeaders,
      'content-length': String(html.byteLength),
      'content-type': 'text/html; charset=utf-8',
    });
    response.end(request.method === 'HEAD' ? undefined : html);
    return;
  }

  if (url.pathname === '/design-system' && (request.method === 'GET' || request.method === 'HEAD')) {
    response.writeHead(308, { location: '/design-system/' });
    response.end();
    return;
  }

  if (url.pathname.startsWith('/design-system/')
    && (request.method === 'GET' || request.method === 'HEAD')) {
    const relativePath = decodeURIComponent(url.pathname.slice('/design-system/'.length)) || 'index.html';
    const filePath = resolve(designSystemDirectory, relativePath);
    const insideDirectory = filePath === designSystemDirectory || filePath.startsWith(`${designSystemDirectory}${sep}`);

    if (insideDirectory) {
      try {
        const body = await readFile(filePath);
        const contentTypes = {
          '.css': 'text/css; charset=utf-8',
          '.html': 'text/html; charset=utf-8',
          '.js': 'text/javascript; charset=utf-8',
          '.json': 'application/json; charset=utf-8',
          '.png': 'image/png',
          '.svg': 'image/svg+xml; charset=utf-8',
        };
        response.writeHead(200, {
          ...securityHeaders,
          'content-length': String(body.byteLength),
          'content-type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
        });
        response.end(request.method === 'HEAD' ? undefined : body);
        return;
      } catch (error) {
        if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
      }
    }
  }

  response.writeHead(404, {
    'cache-control': 'no-store',
    'content-type': 'text/plain; charset=utf-8',
    'x-content-type-options': 'nosniff',
  });
  response.end('Not found');
});

server.listen(port, '127.0.0.1');

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
