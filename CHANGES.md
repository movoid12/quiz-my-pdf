Changelog workflow

This repo uses Changesets and GitHub Actions to automate changelog and version bumps.

How it works

- When a Pull Request is merged, the `Create Changeset from Merged PR` workflow will create a `.changeset/pr-<number>.md` file containing the PR title and body.
- When changes are pushed to `main`, the `Version & Release` workflow runs `pnpm version:changeset` which applies versions and updates the `CHANGELOG.md`.
- The workflow then builds and commits the versioned changes and creates a GitHub Release with the `CHANGELOG.md` as body.

Local helper

- You can run `node scripts/generate-changeset.js <pr-number> <title> [body]` to create a changeset locally for testing.

Notes

- Ensure `@changesets/cli` is installed (it's in devDependencies).
- Workflows assume `pnpm` available on the runner (default on GitHub-hosted runners).
