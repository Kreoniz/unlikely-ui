import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { EventEmitter, once } from 'node:events';
import { spawn } from 'node:child_process';
import { waitForFixture } from '../scripts/consumer-server.mjs';

async function responder(t, html) {
  const server = createServer((request, response) => response.end(html));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(
    () =>
      new Promise((resolve) => {
        server.closeAllConnections();
        server.close(resolve);
      }),
  );
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    port: server.address().port,
  };
}
function runningProcess() {
  return Object.assign(new EventEmitter(), {
    exitCode: null,
    signalCode: null,
  });
}
test('readiness accepts the expected build and CSS mode', async (t) => {
  const { url } = await responder(
    t,
    '<meta name="consumer-build" content="run:plain">',
  );
  await waitForFixture(runningProcess(), url, 'run:plain', () => '', {
    timeoutMs: 500,
  });
});
test('a successful stale responder cannot satisfy a different build', async (t) => {
  const { url } = await responder(
    t,
    '<meta name="consumer-build" content="old:tailwind">',
  );
  await assert.rejects(
    waitForFixture(runningProcess(), url, 'new:plain', () => '', {
      timeoutMs: 100,
      intervalMs: 10,
    }),
    /did not serve build new:plain/,
  );
});
test('an occupied port reports owned process failure instead of testing the old server', async (t) => {
  const { url, port } = await responder(
    t,
    '<meta name="consumer-build" content="old:plain">',
  );
  const child = spawn(
    process.execPath,
    ['-e', `require('node:http').createServer().listen(${port}, '127.0.0.1')`],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );
  let output = '';
  child.stderr.on('data', (chunk) => {
    output += chunk;
  });
  t.after(() => {
    if (child.exitCode === null) child.kill();
  });
  await assert.rejects(
    waitForFixture(child, url, 'new:plain', () => output, {
      timeoutMs: 2000,
      intervalMs: 10,
    }),
    /exited before readiness[\s\S]*EADDRINUSE/,
  );
});
test('spawn failure is surfaced without waiting for HTTP readiness', async () => {
  const child = spawn('/unlikely-ui-missing-fixture-command', []);
  await assert.rejects(
    waitForFixture(child, 'http://127.0.0.1:1', 'run:plain', () => '', {
      intervalMs: 10,
    }),
    /ENOENT/,
  );
});
