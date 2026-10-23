const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Serve only classroom assets, never arbitrary files in the workspace.
const screenshotDir = path.join(__dirname, 'assets', 'screenshots');
const screenshotFiles = fs.existsSync(screenshotDir)
  ? fs.readdirSync(screenshotDir).filter(name => /^[\w-]+\.png$/.test(name)).map(name => `assets/screenshots/${name}`)
  : [];
const publicFiles = new Set([
  'index.html', 'styles.css', 'lessons.js', 'diagrams.js', 'nodes.js', 'quizzes.js', 'media.js', 'app.js',
  'workflows/01-text-to-image.json', 'workflows/02-image-to-image.json', 'workflows/03-z-image-turbo.json',
  'workflows/04-inpaint.json', 'workflows/05-lora-style.json',
  ...screenshotFiles
]);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png' };

function createServer() {
  return http.createServer((request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'no-store');
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
      return;
    }
    let file;
    try {
      const requestPath = decodeURIComponent(request.url.split('?')[0]);
      file = requestPath === '/' ? 'index.html' : requestPath.slice(1);
    } catch {
      response.writeHead(400).end('Invalid URL');
      return;
    }
    if (!request.url.startsWith('/') || !publicFiles.has(file)) {
      response.writeHead(404).end('Not found');
      return;
    }
    fs.readFile(path.join(__dirname, file), (error, content) => {
      if (error) { response.writeHead(500).end('Classroom file unavailable'); return; }
      response.writeHead(200, { 'Content-Type': types[path.extname(file)], 'Content-Length': content.length });
      response.end(request.method === 'HEAD' ? undefined : content);
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('PORT 必须是 1–65535 之间的整数。');
    process.exitCode = 1;
  } else {
    const server = createServer();
    server.on('error', error => { console.error(`无法启动课堂：${error.message}。可直接双击 index.html，或换一个 PORT。`); process.exitCode = 1; });
    server.listen(port, '127.0.0.1', () => { console.log(`Comfy 课堂：http://127.0.0.1:${port}（仅本机访问；Ctrl+C 停止）`); });
  }
}

module.exports = { createServer };
