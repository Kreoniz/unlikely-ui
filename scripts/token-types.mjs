import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile(
  new URL('../src/styles/tokens.css', import.meta.url),
  'utf8',
);
const names = [
  ...new Set(
    [...source.matchAll(/(--u-[\w-]+)\s*:/g)].map((match) => match[1]),
  ),
].filter((name) => !name.startsWith('--u-ref-'));
await writeFile(
  new URL('../src/token-names.ts', import.meta.url),
  '// Generated from styles/tokens.css by scripts/token-types.mjs.\n' +
    `export type ThemeToken =\n${names.map((name) => `  | '${name}'`).join('\n')};\n`,
);
