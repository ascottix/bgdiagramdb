import fs from 'fs/promises';
import path from 'path';

const htmlPath = path.resolve('dist', 'index.html');
const cssPath = path.resolve('dist', 'css', 'styles.css');

const html = await fs.readFile(htmlPath, 'utf8');
const css = await fs.readFile(cssPath, 'utf8');

const inlinedHtml = html.replace(
  /<link\s+rel="stylesheet"\s+href="css\/styles\.css"\s*\/?>/,
  `<style>\n${css}</style>`
);

await fs.writeFile(htmlPath, inlinedHtml);
await fs.unlink(cssPath); // Remove inlined file

console.log('Inlining styles.css into index.html complete.');
