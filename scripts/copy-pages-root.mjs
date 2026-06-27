import { cp, mkdir } from 'node:fs/promises';

await mkdir('dist/assets', { recursive: true });
await cp('assets/app', 'dist/assets/app', { recursive: true, force: true });
