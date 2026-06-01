# Prioriza Method

Prioriza is a decision-making and prioritization method based on ordinal
priority levels. It converts heterogeneous values into priority levels,
combines them with aspect priority levels, preserves ties, and produces a
traceable priority structure that can be reviewed, reused, and explained.

This repository contains the theory manuscript, not a software implementation.
The current manuscript status is `v0.4-draft`.

## Manuscript Source

The editable manuscript is the Quarto book configured by `_quarto.yml`.

- Edit manuscript text in `index.qmd` and `chapters/*.qmd`.
- Store conceptual figures in `figures/`.
- Store bibliography work in `references.bib` and
  `bibliography/bibliography-todo.md`.
- Treat `_output/` as generated output. It is ignored by Git.

The original conversion input is retained under `archive/source-docx/` for
traceability only. The public book should not contain repository, conversion,
or build-process notes.

## Local Rendering

Install Quarto before rendering locally:

```powershell
quarto --version
```

Render commands:

```powershell
quarto render
quarto render --to html
quarto render --to pdf
```

HTML and PDF output is generated under `_output/`.

Preview the static website locally:

```powershell
python -m http.server 8000 -d docs
```

The deployment workflow copies `docs/` into `public/` and then adds the
generated book and PDF outputs. The generated `public/` folder is ignored by
Git.

## Website

The Spanish public website lives under `docs/` and is standard HTML, CSS, and
JavaScript. Quarto is not used to generate the landing page.

- `docs/index.html` is the Spanish landing page.
- `docs/en/index.html` is a future English landing page placeholder.
- `docs/downloads/index.html` is the downloads / releases guide page.
- `docs/tool/index.html` is the future browser-only Prioriza tool route.
- `docs/assets/css/styles.css` contains the site styling.
- `docs/assets/js/main.js` contains light progressive enhancement.

## Bilingual Architecture

Spanish is the canonical source language. The website and manuscript are
authored in Spanish first. English will be a controlled translation later.

URL structure:

```text
/          Spanish landing page (canonical)
/en/       English version placeholder (future)
/downloads/  Releases guide (Spanish for now)
/tool/     Tool UI (Spanish for now)
```

- No language switcher is displayed until English pages contain real content.
- Navigation labels are in Spanish matching the page language.
- English URLs exist but are not linked from Spanish pages until content is ready.
- The `docs/en/` directory reserves the English route without exposing broken links.

The deployed site is expected to expose:

- the downloads page under `/downloads/`;
- the future static tool under `/tool/`;
- links to GitHub Releases for PDF downloads;
- links to the GitHub repository, examples, and public roadmap.
- the HTML book under `/book/` only when a Pages workflow renders it.

## GitHub Workflows

- `ci.yml` checks the static site source (`docs/`), renders the HTML book and
  PDF book on pushes and pull requests, then uploads build artifacts.
- `pages.yml` deploys the static site to GitHub Pages after changes reach
  `master` or `main`; it copies `docs/` into `public/`, then adds the generated
  book under `/book/` and the generated PDF under `/downloads/` when available.
- `release.yml` is manual. It reads `manifest.yml`, renders the PDF, and
  creates a GitHub release only when the manifest version does not already
  exist as a tag.

## Chapter Structure

The book is split into one Quarto file per major section:

- `index.qmd`
- `chapters/00-proposito-tesis-posicionamiento.qmd`
- `chapters/01-introduccion.qmd`
- `chapters/02-problema-general-de-decision.qmd`
- `chapters/03-forma-discreta.qmd`
- `chapters/04-justificacion-del-procedimiento.qmd`
- `chapters/05-empates-contradicciones-decisiones-no-unicas.qmd`
- `chapters/06-reutilizacion-tablas.qmd`
- `chapters/07-recursividad.qmd`
- `chapters/08-ingenieria-inversa.qmd`
- `chapters/09-forma-continua.qmd`
- `chapters/10-formas-generales-de-uso.qmd`
- `chapters/11-aplicaciones-del-metodo.qmd`
- `chapters/12-aplicacion-historica-ancora-goh.qmd`
- `chapters/13-aplicaciones-dinamicas-y-asignacion-recursos.qmd`
- `chapters/14-estado-del-arte.qmd`
- `chapters/15-aporte-real-de-prioriza.qmd`
- `chapters/16-limites-y-criticas.qmd`
- `chapters/17-arquitectura-gobernanza-ia.qmd`
- `chapters/18-especificacion-futura.qmd`
- `chapters/19-conclusiones.qmd`

## Contributor Docs

- `docs/editorial-notes.md` defines the boundary between public manuscript and
  contributor notes.
- `docs/illustration-plan.md` tracks conceptual figure work.
- `docs/release-process.md` documents rendering, artifacts, and release
  naming.
- `docs/custom-domain.md` documents the planned `prioriza.rafageist.com`
  GitHub Pages setup.

## Bibliography Policy

Do not invent references. Add entries to `references.bib` only after verifying
metadata against reliable sources. Use `bibliography/bibliography-todo.md` and
citation notes outside rendered chapters to mark where sources are needed.

## Archive And Legacy Material

- `archive/source-docx/` keeps the DOCX conversion input.
- `archive/legacy-docs/` keeps the previous Markdown/Pandoc manuscript and
  PDF build files.
- Existing `examples/`, `octave/`, `scripts/plots/`, and `images/` content is
  retained as supporting historical/example material.

## Continuing With Codex

When continuing work with Codex, point it at this repository and treat
`_quarto.yml` as the manuscript entry point. Ask it to preserve the Quarto
structure, avoid fabricated bibliography, keep public-book text free of
repository process notes, and document render failures or local tooling gaps in
`WORK_NOTES.md`.

## License

All documents are released under the Creative Commons
Attribution-NonCommercial-ShareAlike 4.0 International license.
