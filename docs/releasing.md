# Releasing unlikely ui

The selected package name is the unscoped `unlikely-ui`. The first release,
`0.1.0-alpha.1`, was published on 2026-10-20 with MIT-licensed code/documentation
and the `next` tag. See [the verified release record](./release-2026-10-20.md).
The workflow below applies to subsequent explicitly authorized releases.

## Check and inspect

Run from the repository root with the pinned mise runtime and pnpm version:

```sh
mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm release:check
mise exec -- pnpm pack --pack-destination .local/packages
tar -tzf .local/packages/unlikely-ui-0.1.0-alpha.2.tgz
```

`release:check` checks TypeScript, generated API extraction, token contrast,
the production showcase, gallery behavior, and the installed tarball in plain
React and consumer Tailwind fixtures. Browser prerequisites are described in
[the showcase guide](./showcase.md#verification). Local fixture dependencies
must already be in pnpm's cache because its installation is offline. GitHub CI
uses `--prefer-offline` so fresh runners can fetch missing dependency metadata.

`prepack` performs a clean library build, including for `pnpm pack` and
`npm publish`. `prepublishOnly` runs the full release check before an ordinary
`npm publish` from this directory. Neither hook runs on consumer installation.
Do not bypass these hooks for an actual release.

The allowlist ships `dist/`, README, LICENSE, CHANGELOG, `USAGE.md`,
`docs/components.md`, and package metadata. Consumer checks inspect the actual
tarball, verify export targets and local guide links, and reject extra files.
The gallery, source tooling, asset explorations, fonts, and mascot stay out of
the package. The software's MIT grant does not relicense excluded artwork or
fonts; their provenance and terms are in `docs/assets.md`.

After checks pass, inspect npm's publish dry run without repeating lifecycle
checks:

```sh
mise exec -- npm publish --dry-run --ignore-scripts --access public --tag next --registry=https://registry.npmjs.org/
```

## Publish separately

Read-only account and name checks:

```sh
mise exec -- npm whoami --registry=https://registry.npmjs.org/
mise exec -- npm view unlikely-ui name versions dist-tags --json --registry=https://registry.npmjs.org/
```

An E404 before the first release means no readable package was found; it does
not reserve the name or guarantee npm will accept it. Confirm the intended
account immediately before publication. npm requires 2FA or an appropriate
granular token for direct publishing. Complete authentication in the terminal
or npm's browser flow; never put credentials into the repository or chat.

Only when publication has been explicitly authorized, run from the repository
root:

```sh
mise exec -- npm publish --access public --tag next --registry=https://registry.npmjs.org/
```

`publishConfig` also specifies the official registry, public access, and `next`
as a defense against an omitted flag. Pass the flags explicitly. A prerelease
version alone does not select the `next` tag. Do not use `--ignore-scripts` for
the actual publish.

Verify the registry after publishing:

```sh
mise exec -- npm view unlikely-ui@0.1.0-alpha.2 version license dist.integrity --json --registry=https://registry.npmjs.org/
mise exec -- npm dist-tag ls unlikely-ui --registry=https://registry.npmjs.org/
```

Only after that succeeds, record the publication date in the repository's
release evidence and install in apps with `pnpm add -E unlikely-ui@0.1.0-alpha.2`.
Keep app lockfiles committed. Shipped consumer guidance is publication-neutral;
registry availability is established by the verification above.

For the first publication, npm briefly exposed a `0.0.0-stage` placeholder
before serving the alpha, and assigned `latest` as well as the requested `next`.
An authenticated `npm dist-tag rm unlikely-ui latest` failed with HTTP 400.
This first-publish behavior is also reported in
[npm/cli#8490](https://github.com/npm/cli/issues/8490). Both tags currently point
to the first alpha. Keep using explicit `--tag next` for later alphas, inspect
the resulting tags, and do not promote later prereleases to `latest`.

## Later releases

Update the package version and changelog together. Follow the version/visual
compatibility policy in [the changelog](../CHANGELOG.md#release-policy).
Change both the publish command and `publishConfig.tag` when moving to beta or
a regular release. Never reuse a published name/version pair.

Source is available in the public GitHub repository
[Kreoniz/unlikely-ui](https://github.com/Kreoniz/unlikely-ui), created on
2026-10-20 and made public at the owner's request on 2026-10-21. The initial
history excludes retired artwork and local caches; see
[the pre-upload audit](./repository-audit-2026-10-20.md). The showcase at
https://ui.kreoniz.ru follows successful `main` builds through GitHub Actions.
Repository, issues, and homepage metadata are included starting with alpha.2.
This does not change the already published alpha.1.
The workflow does not publish npm packages. Commit the reviewed source used
for each release; see [showcase deployment](../deploy/README.md).

## Primary references checked 2026-10-20

- [npm unscoped publication](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages/)
- [npm lifecycle scripts](https://docs.npmjs.com/cli/v11/using-npm/scripts/)
- [npm publish options](https://docs.npmjs.com/cli/v11/commands/npm-publish/)
- [npm distribution tags](https://docs.npmjs.com/adding-dist-tags-to-packages/)
- [MIT license text](https://opensource.org/license/mit)
