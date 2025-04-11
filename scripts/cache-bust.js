import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const distDir = 'dist';
const originalBundle = path.join(distDir, 'bundle.js');
const indexHtmlPath = path.join(distDir, 'index.html');

// Get bundle hash
const data = await fs.readFile(originalBundle);
const hash = crypto.createHash('md5').update(data).digest('hex').slice(0, 8);

// Rename bundle
const newBundleName = `bundle.${hash}.js`;
const newBundlePath = path.join(distDir, newBundleName);
await fs.rename(originalBundle, newBundlePath);

// Update index.html
let html = await fs.readFile(indexHtmlPath, 'utf8');
html = html.replace(/bundle\.js/g, newBundleName);
await fs.writeFile(indexHtmlPath, html);

console.log(`Cache busting complete: ${newBundleName}`);
