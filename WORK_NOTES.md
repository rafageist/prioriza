# Work Notes

## Repository migration notes

- Current canonical manuscript format: Quarto book.
- Current canonical entry point: `_quarto.yml`.
- Latest DOCX source archived at
  `archive/source-docx/Prioriza_Documento_Maestro_V0_3_azar_reactividad_ilustraciones.docx`.
- Legacy Markdown chapters and the old Pandoc PDF build files were moved to
  `archive/legacy-docs/`.
- Existing `examples/`, `octave/`, `scripts/plots/`, and `images/` content is
  retained as supporting historical/example material, not as canonical
  manuscript source.

## Validation notes

- Local Quarto is available at `C:\Program Files\Quarto\bin\quarto.exe`.
- `quarto render --to html` and `quarto render --to pdf` succeeded locally on
  2026-05-31 using that executable.
- The public static website was served locally from `docs/` and returned 200
  for `/`, `/downloads/`, `/tool/`, CSS, JS, and the hero image.
- The CI workflow checks the static HTML/CSS/JS site source and renders the
  HTML book and PDF book on push and pull request events.
- The Pages workflow deploys the static site after changes reach `master` or
  `main`; it copies `docs/` into `public/` and then adds generated book/PDF
  outputs.
- The release workflow is manual. It reads `manifest.yml` and publishes a PDF
  named `prioriza-method-<version>-es.pdf` only when the tag does not already
  exist.

## DOCX conversion notes

- The archived DOCX was converted with Pandoc 3.9.0.2 into
  `tmp/prioriza_raw.md` and split into the Quarto chapter files under
  `chapters/`.
- The generated `tmp/` Markdown and Pandoc-extracted `figures/imported/` media
  are temporary conversion artifacts and are ignored by Git.
- The conceptual figures are versionable SVG files in `figures/`, with PNG
  derivatives committed for PDF rendering on systems without `rsvg-convert`.

## Book cleanup and static website (Issues #14-#21)

Completed on `docs/book-cleanup-and-static-site` branch (commit `28b27de`):

- **Book manuscript cleaned**: preface rewritten reader-facing; all references to Quarto,
  DOCX, `_output`, `GitHub Actions`, TODO, placeholder, issue, workflow, and
  `Plan de ilustraciones` removed from book-facing content.
- **Internal process moved**: `docs/editorial-notes.md`, `docs/illustration-plan.md`,
  `docs/release-process.md`, `docs/custom-domain.md` created.
- **Static website created**: `docs/` with `index.html`, `assets/css/styles.css`,
  `assets/js/main.js`, `tool/index.html` (future tool placeholder),
  `downloads/index.html` (PDF download pending).
- **Three separate workflows**: `ci.yml` (check/render), `pages.yml` (deploy),
  `release.yml` (manual PDF release).
- **No forbidden terms** remain in `index.qmd` or `chapters/`.
- **Author**: Rafael Rodríguez Ramírez.
- **`quarto render --to html` and `quarto render --to pdf`**: both succeed.

## Terminology pass notes

- Internal Prioriza terminology now uses `nivel de prioridad`,
  `nivel de prioridad del elemento`, `nivel de prioridad del aspecto`,
  `nivel de prioridad resultante`, `estructura de prioridad`,
  `función de nivelación`, `nivelación`, `tabla Prioriza`, and
  `ejecución Prioriza`.
- JSON/YAML examples use `aspect_priority_level`, not `weight`.
- The remaining `peso`, `ponderación`, and `suma ponderada` matches are
  intentionally kept only in terminology notes, MCDA comparisons, or
  state-of-the-art/critique passages where external vocabulary is being
  discussed.
