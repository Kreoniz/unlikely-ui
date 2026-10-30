/** Wait for the owned fixture's build, never an unrelated successful responder. */
export async function waitForFixture(
  server,
  url,
  identity,
  output,
  { timeoutMs = 10_000, intervalMs = 100 } = {},
) {
  let startupError;
  const onError = (error) => {
    startupError = error;
  };
  server.on('error', onError);
  const assertRunning = () => {
    if (startupError) throw startupError;
    if (server.exitCode !== null || server.signalCode !== null)
      throw new Error(`Consumer fixture exited before readiness.\n${output()}`);
  };
  try {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      assertRunning();
      let html = '';
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(Math.min(1000, timeoutMs)),
        });
        if (response.ok) html = await response.text();
      } catch {}
      assertRunning();
      if (html.includes(`<meta name="consumer-build" content="${identity}">`))
        return;
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    throw new Error(
      `Consumer fixture did not serve build ${identity}.\n${output()}`,
    );
  } finally {
    server.off('error', onError);
  }
}
