// Zero-dependency local Node.js server with Cross-Origin Isolation headers for SharedArrayBuffer
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Add Cross-Origin Isolation Headers for SharedArrayBuffer support
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') {
    reqPath = '/index.html';
  }

  const filePath = path.join(BASE_DIR, reqPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(BASE_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n🔊 Volume Booster server running!`);
  console.log(`👉 Open in browser: http://localhost:${PORT}`);
  console.log(`🔒 Cross-Origin-Isolation (COOP/COEP) enabled for SharedArrayBuffer\n`);
});
