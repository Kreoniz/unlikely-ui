# Showcase deployment

The public showcase is **https://ui.kreoniz.ru**. It follows `main`, so its
examples and API may be newer than the published npm version. The repository
is public; keep keys, host inventories, backups and deployment evidence in
ignored `.local/` storage. Concept boards remain local too.

## GitHub workflow

`.github/workflows/showcase.yml` checks pull requests, pushes to `main`, and
manual runs. It installs the pinned mise tools, checks formatting, runs the
complete library/consumer/browser gate, tests the deployment receiver, and
uploads only `.local/showcase` as the deployment artifact.

The deployment job runs after successful checks, only for `main`, using the
`production` GitHub environment. Configure that environment to allow only the
`main` branch, with these values:

- Variables: `DEPLOY_HOST` and `DEPLOY_USER`.
- Secrets: `DEPLOY_SSH_KEY` and `DEPLOY_KNOWN_HOSTS`.

Verify the host key using an existing trusted SSH connection. Never disable
host verification or put credentials in source. Actions are pinned by commit;
the workflow token has read access except for deployment status updates.
Fork pull requests run checks without deployment credentials. The VPS is not
a GitHub runner and builds no JavaScript. npm publication is separate.

## Server setup

An operator installs `compose.yaml` and `Caddyfile` in `/opt/unlikely-ui`.
Set `CADDY_IMAGE` in a private `.env` to an approved locally available Caddy
image ID or immutable digest. Compose never pulls or builds implicitly.
The official Caddy binary needs `NET_BIND_SERVICE` in its capability bounding
set even on port 8080; see [the upstream image issue](https://github.com/caddyserver/caddy-docker/issues/396).
All other capabilities are dropped.
The static container has no published host port, joins `beszel-edge` under
`unlikely-ui-showcase:8080`, and mounts only the public site directory read-only.
The existing HTTPS proxy gets this additional route:

```caddyfile
ui.kreoniz.ru {
    reverse_proxy unlikely-ui-showcase:8080
}
```

Back up the current proxy configuration, validate a candidate, compare it with
the current file immediately before applying, preserve its bind-mounted inode,
and reload. Preserve all existing routes and verify them afterward.

Install `receive.py` as root-owned, executable
`/usr/local/libexec/unlikely-ui-receive`. Create an unprivileged
`unlikely-ui-deploy` account with write access only to `/opt/unlikely-ui/site`;
prepare `site/releases` and `site/assets`. Its root-owned authorized-keys file
uses `restrict,command="/usr/local/libexec/unlikely-ui-receive"` for the CI key.
Give it neither sudo nor Docker access. Server scripts/configuration are
updated by the operator, not by the CI key.

`publish.sh` sends a bounded tar archive to that forced command. The receiver
rejects unsafe paths, links, devices, duplicate names, oversized archives, and
immutable asset collisions. It switches `current` atomically after unpacking,
keeping `previous` for rollback. Hashed chunks stay available across releases
for already-open pages. The client verifies every public file against the build
artifact and rolls back on a failed verification. Indexes use `no-cache`;
hashed assets use one-year immutable caching.

## Rollback and maintenance

Using the restricted account/key and pinned host keys:

```sh
ssh unlikely-ui-deploy@YOUR_HOST 'rollback COMMIT_SHA-RUN_ID-ATTEMPT'
```

Use the full ID of the failed **current** release. A stale rollback is refused;
no arbitrary shell command is accepted. Releases live under `site/releases`;
`current` and `previous` are relative symlinks. Retain both targets when cleaning
old releases. Shared hashed assets are retained intentionally; inspect disk use
before removing old files, since browser tabs may still reference them.

For deployment changes, run `bash -n deploy/publish.sh`,
`python3 -m unittest discover -s tests -p 'deployment_test.py'`, and validate the
Caddy/Compose configuration. For runtime/library changes use the existing
component and packed-consumer checks. Operational evidence stays outside Git.
