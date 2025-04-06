import fs from 'fs/promises';

const file = 'dist/bundle.js';

let code = await fs.readFile(file, 'utf8');

code = code.replace(/\s{2,}/g, ' '); // Remove multiple spaces

await fs.writeFile(file, code);

console.log('HTML templates cleanup complete.');
