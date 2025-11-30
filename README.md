# Prioriza Method (Theory Repository)

Prioriza Method is a decision-making and prioritization framework first developed between 2005 and 2010 and now reconstructed for a 2025 edition.

## Purpose
This repository preserves the complete theoretical corpus: definitions, mathematical model, variants, and academic references. It is documentation-first and contains no software.

## PDF Generation
- `manifest.yml` stores the release version used for tags and filenames.
- `pdf-order.txt` defines the chapter order for the compiled book; edit it before each release.
- Workflow `.github/workflows/build-pdf-book.yml` installs Pandoc/LaTeX, runs `scripts/build_pdf.sh`, uploads `prioriza-method-<version>.pdf` as an artifact, and publishes a tagged release.
- Local build example: `BOOK_VERSION=0.1.0-draft BOOK_DATE=$(date +%Y-%m-%d) bash scripts/build_pdf.sh`.

## License
All documents are released under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International license. Full legal text: https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.

## Structure
- docs/: canonical chapters covering the method, model, variants, and applications
- examples/: worked examples for discrete and continuous cases
- thesis/: placeholder workspace for a compiled thesis manuscript

## Implementation Note
The Python implementation will be maintained separately in the Divengine organization as prioriza-py; this repository remains implementation-agnostic.
