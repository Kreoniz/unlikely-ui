import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { posix, resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { waitForFixture } from './consumer-server.mjs';

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
  'package/THIRD_PARTY_NOTICES.md',
  ...consumerDocuments.map((file) => `package/${file}`),
]);
for (const file of packedFiles) {
  if (!file.startsWith('package/dist/') && !allowedFiles.has(file))
    throw new Error(`Unexpected file in the package: ${file}`);
}
if (!packedFiles.has('package/THIRD_PARTY_NOTICES.md'))
  throw new Error('shadcn MIT notice missing from the package');
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
// Compile the actual complete recipes against the packed public API. No gallery CSS.
await mkdir(resolve(target, 'copied'), { recursive: true });
for (const name of [
  'project-dialog',
  'recoverable-settings',
  'due-date-form',
  'empty-state',
  'multiple-groups',
]) {
  const source = await readFile(`dev/examples/${name}.tsx`, 'utf8');
  await writeFile(
    resolve(target, 'copied', `${name}.tsx`),
    source
      .replace(/\.\.\/\.\.\/src\/components\/([\w-]+)\.js/g, 'unlikely-ui/$1')
      .replace(/\.\.\/\.\.\/src\/theme\.js/g, 'unlikely-ui/theme'),
  );
}
await mkdir(resolve(target, 'copied/app-studies'), { recursive: true });
for (const name of [
  'desk.tsx',
  'settings.tsx',
  'types.ts',
  'desk.css',
  'settings.css',
]) {
  const source = await readFile(`dev/experiments/app-studies/${name}`, 'utf8');
  await writeFile(
    resolve(target, 'copied/app-studies', name),
    source.replace(
      /\.\.\/\.\.\/\.\.\/src\/components\/([\w-]+)\.js/g,
      'unlikely-ui/$1',
    ),
  );
}
await mkdir(resolve(target, 'copied/reading-room'), { recursive: true });
for (const name of ['app.tsx', 'app.css']) {
  await cp(
    `tests/adoption/reading-room/${name}`,
    resolve(target, 'copied/reading-room', name),
  );
}
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
      types: ['vite/client'],
      strict: true,
      skipLibCheck: true,
      outDir: 'compiled',
    },
    include: ['app.tsx', 'types.ts', 'copied/**/*.tsx'],
  }),
);
run(
  'pnpm',
  [
    'install',
    process.env.CI ? '--prefer-offline' : '--offline',
    '--ignore-workspace',
    '--ignore-scripts',
    '--no-frozen-lockfile',
  ],
  { cwd: target },
);
run('pnpm', ['exec', 'tsc'], { cwd: target });
run(process.execPath, ['ssr.mjs'], { cwd: target });
for (const mode of ['plain', 'tailwind']) {
  const identity = `${randomUUID()}:${mode}`;
  const env = {
    ...process.env,
    CONSUMER_TAILWIND: mode === 'tailwind' ? '1' : '0',
    UI_CONSUMER_URL: 'http://127.0.0.1:5181',
    UI_CONSUMER_MODE: mode,
    UI_CONSUMER_BUILD: identity,
  };
  run('pnpm', ['exec', 'vite', 'build'], { cwd: target, env });
  const server = spawn('pnpm', ['exec', 'vite', 'preview'], {
    cwd: target,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });
  const stopped = new Promise((resolve) => server.once('close', resolve));
  let startupOutput = '';
  const recordOutput = (chunk) => {
    startupOutput = (startupOutput + chunk.toString()).slice(-4000);
  };
  server.stdout.on('data', recordOutput);
  server.stderr.on('data', recordOutput);
  try {
    await waitForFixture(
      server,
      env.UI_CONSUMER_URL,
      identity,
      () => startupOutput,
    );
    run('pnpm', ['exec', 'playwright', 'test', '--project=consumer'], {
      cwd: root,
      env,
    });
  } finally {
    try {
      if (server.pid) process.kill(-server.pid, 'SIGTERM');
    } catch {}
    await stopped;
  }
}
console.log(
  'Packed consumer passed without Tailwind and with consumer Tailwind; types, SSR hydration, style isolation and portal inheritance verified.',
);
