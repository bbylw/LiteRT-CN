import { watch } from 'fs';
import { join } from 'path';

const PORT = Number(process.env.PORT) || 3000;

// Set of connected SSE clients for live reload
const clients = new Set<ReadableStreamDirectController>();

// Watch files in src and root for changes
let reloadTimeout: Timer | null = null;
const notifyClients = () => {
  if (reloadTimeout) clearTimeout(reloadTimeout);
  reloadTimeout = setTimeout(() => {
    console.log('🔄 File changed, reloading browser...');
    for (const controller of clients) {
      try {
        controller.write('data: reload\n\n');
      } catch {
        clients.delete(controller);
      }
    }
  }, 50);
};

try {
  watch('./src', { recursive: true }, notifyClients);
  watch('./index.html', notifyClients);
} catch (e) {
  console.warn('Watch setup warning:', e);
}

// Dev server
console.log(`\n🚀 LiteRT Dev Server running at: http://localhost:${PORT}`);
console.log(`⚡ Powered purely by React 19 & Bun (Native Bundler & Server)\n`);

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // 1. Live reload SSE stream
    if (url.pathname === '/__dev_sse__') {
      return new Response(
        new ReadableStream({
          type: 'direct',
          pull(controller) {
            clients.add(controller);
          },
          cancel(controller) {
            clients.delete(controller as unknown as ReadableStreamDirectController);
          }
        }),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive'
          }
        }
      );
    }

    // 2. Dynamic Bundle on-the-fly via Bun.build
    if (url.pathname === '/main.js' || url.pathname === '/main.css') {
      const build = await Bun.build({
        entrypoints: ['./src/main.tsx'],
        target: 'browser',
        sourcemap: 'inline'
      });

      if (!build.success) {
        console.error('❌ Build errors:');
        for (const log of build.logs) console.error(log);
        return new Response(`console.error(${JSON.stringify(build.logs.map(l => l.message).join('\n'))})`, {
          headers: { 'Content-Type': 'application/javascript' }
        });
      }

      for (const output of build.outputs) {
        if (url.pathname === '/main.js' && output.path.endsWith('.js')) {
          return new Response(await output.arrayBuffer(), {
            headers: { 'Content-Type': 'application/javascript; charset=utf-8' }
          });
        }
        if (url.pathname === '/main.css' && output.path.endsWith('.css')) {
          return new Response(await output.arrayBuffer(), {
            headers: { 'Content-Type': 'text/css; charset=utf-8' }
          });
        }
      }

      // If CSS was requested directly and not emitted separately
      if (url.pathname === '/main.css') {
        const cssFile = Bun.file('./src/index.css');
        if (await cssFile.exists()) {
          return new Response(await cssFile.arrayBuffer(), {
            headers: { 'Content-Type': 'text/css; charset=utf-8' }
          });
        }
      }
    }

    // 3. Serve index.html with live-reload client injected
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const htmlFile = Bun.file('./index.html');
      let html = await htmlFile.text();

      // Inject reload script and css/js paths
      const liveReloadScript = `
        <script>
          const evtSource = new EventSource('/__dev_sse__');
          evtSource.onmessage = () => {
            console.log('[Bun Dev] Hot reload triggered');
            location.reload();
          };
        </script>
      `;

      html = html
        .replace(
          '<script type="module" src="/src/main.tsx"></script>',
          '<script type="module" src="/main.js"></script>'
        )
        .replace(
          '</head>',
          `  <link rel="stylesheet" href="/main.css">\n  ${liveReloadScript}\n</head>`
        );

      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 4. Static file fallback
    const staticPath = join('.', url.pathname);
    const file = Bun.file(staticPath);
    if (await file.exists()) {
      return new Response(file);
    }

    return new Response('Not Found', { status: 404 });
  }
});
