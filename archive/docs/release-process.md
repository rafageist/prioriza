# Release Process

This repository uses `manifest.yml` as the source for the public version
identifier.

## Local Validation

Install Quarto before rendering locally:

```powershell
quarto --version
quarto render --to html
quarto render --to pdf
```

Generated files are written to `_output/` and are not committed.

## Continuous Integration

The CI workflow checks the static website source, renders book HTML and PDF on
pushes and pull requests, and uploads artifacts for inspection.

The public website is not generated with Quarto. The Pages workflow copies
`docs/` into `public/`, then adds the generated book under `public/book/` and
the generated PDF under `public/downloads/` when PDF rendering succeeds.

## Manual Release

The release workflow is manual. It reads the version from `manifest.yml`,
renders the book, prepares a PDF named:

```text
prioriza-method-<version>-es.pdf
```

It then creates a GitHub release using the same version as the tag. If that
tag already exists, the workflow stops and asks for a new manifest version
instead of overwriting a release.

This avoids repeated failing releases when a draft tag has already been used.
