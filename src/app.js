import { readFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDirectory = resolve(projectRoot, 'public');

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

      if (!filePath) {
        sendNotFound(response);
        return;
      }

      const body = await readFile(filePath);
      response.writeHead(200, {
        'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream'
      });
      response.end(body);
    } catch (error) {
      if (['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error?.code)) {
        sendNotFound(response);
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
  try {
    const normalizedPath = pathname === '/' ? '/index.html' : decodeURIComponent(pathname);
    const requestedPath = resolve(publicDirectory, `.${normalizedPath}`);
    const relativePath = relative(publicDirectory, requestedPath);

    if (relativePath === '' || relativePath.startsWith('..') || relativePath.startsWith(sep)) {
      return null;
    }

    return requestedPath;
  } catch (error) {
    if (error instanceof URIError) {
      return null;
    }

    throw error;
  }
}

function sendNotFound(response) {
  sendJson(response, 404, {
    error: 'Not Found',
    message: 'The requested TriniphiX resource does not exist.'
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(payload));
}
