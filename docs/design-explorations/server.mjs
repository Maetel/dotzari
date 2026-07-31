import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';

const port = Number(process.env.PORT || 4318);

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

const securityHeaders = {
  'cache-control': 'public, max-age=300',
  'content-security-policy': "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
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
