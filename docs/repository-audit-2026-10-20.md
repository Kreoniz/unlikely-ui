# Source upload audit — 2026-10-20

The owner requested a private GitHub repository and an independent subagent
review for confidential data and retired character artwork before upload.
The repository target is [Kreoniz/unlikely-ui](https://github.com/Kreoniz/unlikely-ui).
It was created empty and its visibility verified as PRIVATE before uploading
source.

## Findings

- Before initialization, this project had no `.git` directory, parent Git
  repository, commits, refs, or remote history available locally. There was no
  history to rewrite. A reviewed initial commit avoids introducing retired
  files in the first place.
- The subagent inspected 130 source/document/asset files using credential,
  private-key, token, JWT, credential-assignment, and credential-bearing URL
  patterns. No credential matches were found. No eligible `.env`, `.npmrc`,
  key files, logs, archives, or symlinks were found.
- The two embedded PNGs in the generated foundations sheet exactly match the
  current red-button logo. The implementation overview has no embedded images.
  Current PNG assets contain no text or EXIF metadata.
- Inspected ignored logs/JSON and all four local npm archives had no matched
  credentials. Those package archives contain no artwork, embedded images,
  or local home paths. `.local/`, dependencies, builds, generated API data,
  and browser outputs stay outside Git.
- Build/test scripts use scoped output directories and argument-array
  subprocess calls. The review found no suspicious upload or obfuscated
  executable code. Without earlier source revisions, it cannot reconstruct
  every historical implementation change.

## Cleanup before the initial commit

The original retired character images were already in ignored
`.local/retired-assets/`. These additional unused paths were moved there,
preserving their relative paths and deleting no files:

- `docs/brand/mascot-concepts/`
- `docs/brand/knot-concepts/`
- `docs/brand/unlikely-space-concepts/`
- `docs/research-mascot-rights-2026-10-19.md`
- `docs/research-mascot-russia-2026-10-19.md`
- `docs/research-mascot-us-uk-2026-10-19.md`
- `docs/research-mascot-provenance-2026-10-19.md`

The current red-button assets, their provenance, MIT license, and Inter font
license remain in source. Ignore rules additionally cover `.env`/`.env.*`
(with `.env.example` allowed), local `.npmrc`, logs, and package archives.
The initial commit uses the account's GitHub noreply author address instead
of the machine's personal-email default.

An independent final review of the Git index found 108 staged regular files,
no symlinks or submodules, no excluded paths, and no matched credential patterns.
Both embedded foundation images matched the staged red-button logo. Ignore
checks, author/committer identity, and `git diff --cached --check` passed.

## Scope

This is an audit of the available local files and the first source upload.
No earlier Git history or past external uploads were available to inspect.
Pattern scans cannot prove absence of every encoded or unfamiliar secret.
Archiving artwork does not establish rights to it; the retired assets remain
excluded. The findings do not justify rewriting nonexistent history or
rotating credentials without evidence of exposure.
