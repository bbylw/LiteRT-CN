import { existsSync, mkdirSync, writeFileSync, copyFileSync } from 'fs';
import { basename } from 'path';

console.log('⚡ Starting Bun production build...');
const startTime = performance.now();

// 1. Run Bun.build
const buildResult = await Bun.build({
  entrypoints: ['./src/main.tsx'],
  outdir: './dist',
  target: 'browser',
  minify: true,
  naming: {
    entry: '[name].[ext]',
    asset: '[name].[ext]',
    chunk: '[name]-[hash].[ext]'
  }
});

if (!buildResult.success) {
  console.error('❌ Build failed with errors:');
  for (const message of buildResult.logs) {
    console.error(message);
  }
  process.exit(1);
}

// 2. Read template index.html and generate dist/index.html
const indexHtmlContent = await Bun.file('./index.html').text();

// Replace entry script with bundled main.js & add bundled main.css
let distHtml = indexHtmlContent
  .replace(
    '<script type="module" src="/src/main.tsx"></script>',
    '<script type="module" src="./main.js"></script>'
  )
  .replace(
    '</head>',
    '  <link rel="stylesheet" href="./main.css">\n</head>'
  );

if (!existsSync('./dist')) {
  mkdirSync('./dist', { recursive: true });
}

writeFileSync('./dist/index.html', distHtml, 'utf-8');

// 3. Copy CNAME if present
if (existsSync('./CNAME')) {
  copyFileSync('./CNAME', './dist/CNAME');
  console.log('  🌐 Copied CNAME -> dist/CNAME');
}

const duration = (performance.now() - startTime).toFixed(2);
console.log(`\n✨ Build completed in ${duration}ms:`);
for (const output of buildResult.outputs) {
  const sizeKb = (output.size / 1024).toFixed(2);
  console.log(`  📦 dist/${basename(output.path)} (${sizeKb} KB)`);
}
const htmlFile = Bun.file('./dist/index.html');
console.log(`  📄 dist/index.html (${(htmlFile.size / 1024).toFixed(2)} KB)`);
