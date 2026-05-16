import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(fileURLToPath(import.meta.url), '..', '..');
const publicDirectory = join(projectRoot, 'public');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

export function createApp() {
  return async function app(request, response) {
    try {
      const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

      if (url.pathname === '/health') {
        sendJson(response, 200, {
          status: 'ok',
          service: 'triniphix-node',
          company: 'TriniphiX'
        });
        return;
      }

      const filePath = resolvePublicPath(url.pathname);
      const body = await readFile(filePath);
      response.writeHead(200, {
        'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream'
      });
      response.end(body);
    } catch (error) {
      if (error?.code === 'ENOENT') {
        sendJson(response, 404, {
          error: 'Not Found',
          message: 'The requested TriniphiX resource does not exist.'
        });
        return;
      }

      sendJson(response, 500, {
        error: 'Internal Server Error',
        message: 'TriniphiX could not process the request.'
      });
    }
  };
}

function resolvePublicPath(pathname) {
  const normalizedPath = pathname === '/' ? '/index.html' : pathname;
  const safePath = normalizedPath.replace(/^\/+/, '').replace(/\.\.(\/|\\)/g, '');
  return join(publicDirectory, safePath);
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(payload));
}
