import { join } from 'path';

const PORT = Number(process.env.PORT) || 3000;

console.log(`\n🚀 LiteRT Production Preview Server running at: http://localhost:${PORT}`);
console.log(`📂 Serving static files from ./dist\n`);

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;
    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }

    const filePath = join('./dist', pathname);
    const file = Bun.file(filePath);

    if (await file.exists()) {
      return new Response(file);
    }

    // SPA fallback to index.html
    const indexFile = Bun.file('./dist/index.html');
    if (await indexFile.exists()) {
      return new Response(indexFile);
    }

    return new Response('404 Not Found', { status: 404 });
  }
});
