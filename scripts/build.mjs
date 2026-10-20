import { cp, mkdir, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
run(process.execPath, ['scripts/token-types.mjs']);
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
run('pnpm', ['exec', 'tsc', '-p', 'tsconfig.build.json']);
run('pnpm', [
  'exec',
  'tailwindcss',
  '-i',
  'src/styles/index.css',
  '-o',
  'dist/styles.css',
  '--minify',
]);
await cp('src/styles/tokens.css', 'dist/tokens.css');
await cp('src/styles/tailwind.css', 'dist/tailwind.css');
