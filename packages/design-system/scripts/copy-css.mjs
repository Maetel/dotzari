import { copyFile, mkdir } from 'node:fs/promises';

await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await Promise.all([
  copyFile(new URL('../src/tokens.css', import.meta.url), new URL('../dist/tokens.css', import.meta.url)),
  copyFile(new URL('../src/base.css', import.meta.url), new URL('../dist/base.css', import.meta.url)),
]);
