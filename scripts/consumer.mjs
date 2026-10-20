import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { posix, resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const root = process.cwd();
const target = resolve('.local/consumer');
const manifest = JSON.parse(await readFile('package.json', 'utf8'));
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(' ')} failed (${result.status})`);
}
// Packing runs prepack, proving that a clean build is included in the workflow.
await mkdir('.local/packages', { recursive: true });
run('pnpm', ['pack', '--pack-destination', '.local/packages']);
const presentation = new Set([
  './spinner',
  './skeleton',
  './badge',
  './alert',
  './card',
]);
for (const file of Object.entries(manifest.exports)
  .filter(
    ([name, entry]) =>
      name !== '.' && !presentation.has(name) && typeof entry === 'object',
  )
  .map(([, entry]) => entry.import)) {
  if (!/^['"]use client['"];/.test(await readFile(file, 'utf8')))
    throw new Error(`Client boundary missing from ${file}`);
}
for (const name of presentation) {
  const file = manifest.exports[name].import;
  if (/^['"]use client['"];/.test(await readFile(file, 'utf8')))
    throw new Error(`Unnecessary client boundary in ${file}`);
}
const archiveName = `${manifest.name.replace(/^@/, '').replaceAll('/', '-')}-${manifest.version}.tgz`;
const archive = resolve('.local/packages', archiveName);
const listing = spawnSync('tar', ['-tzf', archive], { encoding: 'utf8' });
if (listing.status !== 0) throw new Error('Could not inspect package archive');
const packedFiles = new Set(listing.stdout.trim().split('\n'));
const consumerDocuments = [
  'README.md',
  'CHANGELOG.md',
  'USAGE.md',
  'docs/components.md',
];
const allowedFiles = new Set([
  'package/package.json',
  'package/LICENSE',
  ...consumerDocuments.map((file) => `package/${file}`),
]);
for (const file of packedFiles) {
  if (!file.startsWith('package/dist/') && !allowedFiles.has(file))
    throw new Error(`Unexpected file in the package: ${file}`);
}
if (!packedFiles.has('package/LICENSE'))
  throw new Error('MIT license missing from the package');
const packedManifest = JSON.parse(
  spawnSync('tar', ['-xOf', archive, 'package/package.json'], {
    encoding: 'utf8',
  }).stdout,
);
if (
  packedManifest.name !== manifest.name ||
  packedManifest.version !== manifest.version ||
  packedManifest.private === true ||
  packedManifest.license !== 'MIT'
)
  throw new Error('Packed release identity or license is incorrect');
if (
  /-alpha\./.test(manifest.version) &&
  (manifest.publishConfig?.tag !== 'next' ||
    manifest.publishConfig?.access !== 'public' ||
    manifest.publishConfig?.registry !== 'https://registry.npmjs.org/')
)
  throw new Error(
    'Alpha releases must use public access and the next tag on npm',
  );
for (const entry of Object.values(packedManifest.exports)) {
  for (const path of typeof entry === 'string'
    ? [entry]
    : Object.values(entry)) {
    if (!packedFiles.has(`package/${path.replace(/^\.\//, '')}`))
      throw new Error(`Export target missing from package: ${path}`);
  }
}
for (const file of consumerDocuments) {
  const member = `package/${file}`;
  if (!packedFiles.has(member))
    throw new Error(`Consumer documentation missing from the package: ${file}`);
  const document = spawnSync('tar', ['-xOf', archive, member], {
    encoding: 'utf8',
  });
  if (document.status !== 0)
    throw new Error(`Could not read packed consumer documentation: ${file}`);
  for (const [, href] of document.stdout.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(href)) continue;
    const path = decodeURIComponent(href.split(/[?#]/)[0]);
    const destination = posix.normalize(
      posix.join(posix.dirname(member), path),
    );
    if (!packedFiles.has(destination))
      throw new Error(`Broken local link in packed ${file}: ${href}`);
  }
}
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp('tests/consumer', target, { recursive: true });
const devNames = [
  'vite',
  'typescript',
  '@types/react',
  '@types/react-dom',
  '@types/node',
  'tailwindcss',
  '@tailwindcss/vite',
];
await writeFile(
  resolve(target, 'package.json'),
  JSON.stringify(
    {
      name: 'unlikely-ui-consumer-fixture',
      private: true,
      type: 'module',
      packageManager: manifest.packageManager,
      dependencies: {
        [manifest.name]: `file:${archive}`,
        react: manifest.devDependencies.react,
        'react-dom': manifest.devDependencies['react-dom'],
      },
      devDependencies: Object.fromEntries(
        devNames.map((name) => [name, manifest.devDependencies[name]]),
      ),
    },
    null,
    2,
  ),
);
await writeFile(
  resolve(target, 'tsconfig.json'),
  JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      lib: ['ES2022', 'DOM'],
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      jsx: 'react-jsx',
      strict: true,
      skipLibCheck: true,
      outDir: 'compiled',
    },
    include: ['app.tsx', 'types.ts'],
  }),
);
run(
  'pnpm',
  [
    'install',
    '--offline',
    '--ignore-workspace',
    '--ignore-scripts',
    '--no-frozen-lockfile',
  ],
  { cwd: target },
);
run('pnpm', ['exec', 'tsc'], { cwd: target });
run(process.execPath, ['ssr.mjs'], { cwd: target });
for (const mode of ['plain', 'tailwind']) {
  const env = {
    ...process.env,
    CONSUMER_TAILWIND: mode === 'tailwind' ? '1' : '0',
    UI_CONSUMER_URL: 'http://127.0.0.1:5181',
    UI_CONSUMER_MODE: mode,
  };
  run('pnpm', ['exec', 'vite', 'build'], { cwd: target, env });
  const server = spawn('pnpm', ['exec', 'vite', 'preview'], {
    cwd: target,
    env,
    stdio: 'ignore',
    detached: true,
  });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        const response = await fetch(env.UI_CONSUMER_URL);
        if (response.ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!ready) throw new Error('Consumer fixture did not start');
    run('pnpm', ['exec', 'playwright', 'test', '--project=consumer'], {
      cwd: root,
      env,
    });
  } finally {
    try {
      process.kill(-server.pid, 'SIGTERM');
    } catch {}
    if (server.exitCode === null && server.signalCode === null)
      await new Promise((resolve) => server.once('exit', resolve));
  }
}
console.log(
  'Packed consumer passed without Tailwind and with consumer Tailwind; types, SSR hydration, style isolation and portal inheritance verified.',
);
