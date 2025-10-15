const http = require('http');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT ? Number(process.env.PORT) : 4173;
const rootDir = path.resolve(__dirname, '..');

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function sanitizeRequestUrl(urlPath) {
  const withoutQuery = urlPath.split('?')[0];
  const decoded = decodeURIComponent(withoutQuery);
  const normalized = path.posix.normalize(decoded.replace(/\\/g, '/'));
  if (normalized.includes('..')) {
    return null;
  }
  return normalized;
}

function resolveFilePath(requestPath) {
  if (!requestPath || requestPath === '/' || requestPath === '/index.html') {
    return path.join(rootDir, 'index.html');
  }
  const candidate = path.join(rootDir, requestPath);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    return path.join(candidate, 'index.html');
  }
  return candidate;
}

function sendNotFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
  res.end('Not found');
}

function sendServerError(res, error) {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
  res.end(`Server error: ${error.message}`);
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    sendServerError(res, new Error('Invalid request'));
    return;
  }

  const safePath = sanitizeRequestUrl(req.url);
  if (!safePath) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  const filePath = resolveFilePath(safePath);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(rootDir)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(resolved, (err, stats) => {
    if (err || !stats.isFile()) {
      sendNotFound(res);
      return;
    }

    const ext = path.extname(resolved).toLowerCase();
    res.statusCode = 200;
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');

    const stream = fs.createReadStream(resolved);
    stream.on('error', (streamErr) => {
      sendServerError(res, streamErr);
    });
    stream.pipe(res);
  });
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Acumen CRM ready at http://localhost:${address.port}`);
});

server.on('error', (error) => {
  console.error('Failed to start development server:', error.message);
  process.exitCode = 1;
});

server.listen(port);
